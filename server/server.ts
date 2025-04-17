import express from "express";
import helmet from "helmet";
import cors from "cors";
import https from "https";
import fs from "fs";
import { MongoClient, Db } from "mongodb";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

const app = express();
const port = 8999;

// Middleware

app.use(express.json());

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
  }

  if (otp == stored.otp) {
    delete storeOTP[email];
    let usercollection = db.collection("users");
    await usercollection.updateOne(
      { email: email },
      { $set: { isverified: true } }
    );
    res.status(200).json({ message: "true" });
  } else {
    res.status(400).json({ message: "false" });
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
}, 300000);

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

https.createServer(sslOptions, app).listen(port, () => {
  console.log("Server is Running");
});
