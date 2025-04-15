import express from "express";
import helmet from "helmet";
import cors from "cors";
import https from "https";
import fs from "fs";
import { MongoClient, Db } from "mongodb";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

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

// APIs

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

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
        res.status(200).json({ message: "Success" });
      } else {
        res.status(400).json({ message: "Failed to register user." });
      }
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

https.createServer(sslOptions, app).listen(port, () => {
  console.log("Server is Running");
});
