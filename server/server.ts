import express from "express";
import helmet from "helmet";
import cors from "cors";
import https from "https";
import fs from "fs";
import path from "path";


const app = express();
const port = 8999;

// Security Hardening

app.use(helmet());
app.use(cors({ origin: ["https://localhost:8999"] }));

// Securing server with HTTPS

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'cert/server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'cert/server.cert'))
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

app.post("/signup", (req, res) => {});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
