import express from "express";
import helmet from "helmet";
import cors from "cors";
import https from "https";
import fs from "fs";
import { MongoClient, Db, Timestamp } from "mongodb";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import session from "express-session";
import connectMongo from "connect-mongo";

import "express-session";

declare module "express-session" {
  // Extending SessionData to include a user object
  interface SessionData {
    user?: {
      email: string;
    };
  }
}

// Database Connection & env

dotenv.config();
let db_url = process.env.MONGO_URI;
let db: Db;

const client = new MongoClient(db_url || "");

async function main() {
  await client.connect();
  db = client.db("auth");
  console.log("Connected to Database");
  return true;
}

main();

const app = express();
const port = 8999;

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session

const clientPromise = client.connect().then(() => client);

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60, // 1 Hr
    },
    store: connectMongo.create({
      clientPromise,
      collectionName: "sessions",
    }),
  })
);

// Security Hardening

app.use(helmet());

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Securing server with HTTPS

const sslOptions = {
  cert: fs.readFileSync("cert/localhost.pem"),
  key: fs.readFileSync("cert/localhost-key.pem"),
};

app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect("https://" + req.headers.host + req.url);
  }
});

// OTP Generation & Sending

const transport = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASS,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

interface otpType {
  otp: number | string;
  expiresAt: number;
}

let storeOTP: Record<string, otpType> = {};

const sendOTP = async (mail: string) => {
  let userOTP = generateOTP();
  let time = Date.now() + 300000;
  storeOTP[mail] = { otp: userOTP, expiresAt: time };
  // Check OTP exist on the server
  await transport.sendMail({
    from: '"Auth-Provider" <no-reply@authprovider.com>',
    to: `${mail}`,
    subject: "Email Verification Code",
    html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #2a7d9a;">Email Verification</h2>
          <p>Dear User,</p>
          <p>Thank you for choosing to use our services. To verify your email address, please use the following one-time password (OTP):</p>
          <h3 style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; font-size: 18px; color: #333;">${userOTP}</h3>
          <p>This OTP is valid for the next 5 minutes.</p>
          <p>If you did not request this, please ignore this message.</p>
          <p>Best regards,</p>
          <p style="font-weight: bold;">The Auth-Provider Team</p>
          <p style="font-size: 12px; color: #888;">If you have any questions or issues, feel free to reach out to our support team.</p>
        </div>
      `,
  });
  return 1;
};

// APIs

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

// API for Handling SignUp

app.post("/api/signup", async (req, res) => {
  let currentDate = new Date().toUTCString();
  let generateID = uuidv4();
  const { username, password, email } = req.body;

  try {
    let hashedpassword = await bcrypt.hash(password, 10);
    let userData = {
      username,
      password: hashedpassword,
      email,
      userid: generateID,
      created_at: currentDate,
      isverified: false,
      loginattempt: 0,
    };

    const usercollection = db.collection("users");
    const findUser = await usercollection.findOne({ email });

    if (findUser) {
      res.status(404).json({ message: "Account with this email exists." });
    } else {
      const setData = await usercollection.insertOne(userData);
      if (setData.acknowledged) {
        sendOTP(email);
        res.status(200).json({ message: "Success" });
      } else {
        res.status(400).json({ message: "Failed to register user." });
      }
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

app.get("/api/session", (req, res) => {
  if (req.session.user) {
    res
      .status(200)
      .json({ message: "User is logged in", user: req.session.user });
  } else {
    res.status(401).json({ message: "No active session" });
  }
});

// API for OTP verification

app.post("/api/otp/:email", async (req, res) => {
  let email = req.params.email;
  let { otp } = req.body;
  let stored = storeOTP[email];

  if (!stored) {
    res.status(400).json({ message: "No OTP found for this email!" });
  }

  if (Date.now() > stored.expiresAt) {
    delete storeOTP[email];
    res.status(404).json({ message: "OTP has been expired!" });
    return;
  }

  if (otp == stored.otp) {
    delete storeOTP[email];
    let usercollection = db.collection("users");
    await usercollection.updateOne(
      { email: email },
      { $set: { isverified: true } }
    );

    // Creating sesion for the user
    req.session.user = { email };

    res.status(200).json({ message: "Verified User" });
  } else {
    res.status(400).json({ message: "Failed" });
  }
});

// Interval to delete expired OTP

setInterval(() => {
  const realTime = Date.now();
  let expiredcount = 0;

  for (let mail in storeOTP) {
    if (storeOTP[mail].expiresAt < realTime) {
      console.log(`OTP for this ${mail} has expired and will be removed`);
      delete storeOTP[mail];
      expiredcount++;
    }
  }
  if (expiredcount > 0) {
    console.log(`${expiredcount} expired OTPs removed`);
  }
}, 3000000);

// API for new otp generation

app.post("/api/new", async (req, res) => {
  let { email } = req.body;
  let stored = storeOTP[email];

  if (stored) {
    delete storeOTP[email];
  }

  let sendResult = await sendOTP(email);
  if (sendResult) {
    res
      .status(200)
      .json({ message: "We've emailed new otp you a 6-digit OTP." });
  } else {
    res.status(400).json({ message: "Failed to send OTP" });
  }
});

// API for Login

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let usercollection = db.collection("users");
    // Find the user and Spam protection
    let findUser = await usercollection.findOne({ email });
    if (!findUser) {
      res.status(404).json({ message: "User not found!" });
    } else if (findUser.loginattempt > 3) {
      res.status(400).json({
        message:
          "Account is Blocked due too many login attempts, try again after some time!",
        terminate: true,
      });
      return;
    } else {
      // Matching the conditions;
      const matchPassword = await bcrypt.compare(password, findUser.password);
      if (matchPassword) {
        res.status(200).json({ message: "User Found" });
        req.session.user = { email };
        await usercollection.updateOne(
          { email },
          { $set: { loginattempt: 0 } }
        );
      } else {
        await usercollection.updateOne(
          { email },
          { $inc: { loginattempt: 1 } }
        );
        res.status(404).json({ message: "Incorrect Password" });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error!", systemError: error });
  }
});

// API for Forgot password

app.use("/api/forgot", async (req, res) => {
  try {
    let { email } = req.body;
    let usercollection = db.collection("users");
    let findUser = await usercollection.findOne({ email });
    if (findUser) {
      sendOTP(email);
      res.status(200).json({ message: "User Found!" });
    } else {
      res.status(404).json({ message: "User Does not Exist" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error!", systemError: error });
  }
});

app.use("/api/change", async (req, res) => {
  try {
    let { email, password } = req.body;
    let usercollection = db.collection("users");
    let hashedpassword = await bcrypt.hash(password, 10);
    let findUser = await usercollection.findOne({ email });
    if (findUser) {
      let setPassword = await usercollection.updateOne(
        { email },
        { $set: { password: hashedpassword } }
      );
      if (setPassword) {
        res
          .status(200)
          .json({ message: "Password has been change now u can Login" });
      } else {
        res.status(404).json({ message: "Failed to Change password" });
      }
    } else {
      res.status(404).json({ message: "User not Found!" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error!", systemError: error });
  }
});

// API to Logout the user

app.delete("/api/destroysession/:email", async (req, res) => {
  const { email } = req.body;
  try {
    const sessionCollection = db.collection("sessions");

    // Find sessions containing this email
    const sessions = await sessionCollection
      .find({
        session: { $regex: email },
      })
      .toArray();

    if (sessions.length === 0) {
      res
        .status(404)
        .json({ message: "No active session found for this user" });
    }

    // Delete those sessions
    const sessionIds = sessions.map((sess) => sess._id);
    await sessionCollection.deleteMany({ _id: { $in: sessionIds } });

    res
      .status(200)
      .json({ message: `Sessions for ${email} have been destroyed` });
  } catch (error) {
    res.status(500).json({ message: "Failed to destroy sessions", error });
  }
});

https.createServer(sslOptions, app).listen(port, () => {
  console.log("Server is Running");
});
