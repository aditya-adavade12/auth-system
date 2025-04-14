import express from "express";
import helmet from "helmet";
import cors from "cors";
import https from "https";
import fs from "fs";


const app = express();
const port = 8999;

// Middleware

app.use(express.json());

// Security Hardening

app.use(helmet());

const corsOptions =  {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders : ["Content-Type", "Authorization"]
}

app.use(cors(corsOptions));

// Securing server with HTTPS

const sslOptions = {
  cert: fs.readFileSync('cert/localhost.pem'),
  key: fs.readFileSync('cert/localhost-key.pem')
}

https.createServer(sslOptions, app).listen(port, () => {
  console.log("Running the server");
  
});

app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
      res.redirect('https://' + req.headers.host + req.url);
  }
});

// APIs


app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.post("/api/signup", (req, res) => {
  console.log(req.body);
  res.send({message: "Working"});
  
})


app.post("/signup", (req, res) => {});

