const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
const uri = process.env.mongo_uri; // Ensure you set this in your .env file
const client = new MongoClient(uri);
const dbName = "emailtemplate"; // Changed the database name as per your request

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to the ${dbName} database`);
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
    process.exit(1); // Exit process on database connection error
  }
};

connectToDatabase();

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// API to get the email layout
app.get("/getEmailLayout", (req, res) => {
  fs.readFile("./layout.html", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading layout file.");
    res.json({ layout: data });
  });
});

// API to upload an image URL or Base64 string
app.post("/uploadImage", (req, res) => {
  const { imageUrl } = req.body; // Accept the image URL or Base64 string from the client
  if (!imageUrl) return res.status(400).send("No image data provided.");
  res.json({ message: "Image data received.", imageUrl });
});

// API to store email template configuration in the database
app.post("/uploadEmailConfig", async (req, res) => {
  const emailConfig = req.body;

  try {
    const db = client.db(dbName);
    const collection = db.collection("emailConfigs");

    const result = await collection.insertOne(emailConfig);
    res.json({ message: "Email configuration saved.", id: result.insertedId });
  } catch (err) {
    console.error(`Error saving email configuration: ${err}`);
    res.status(500).send("Error saving email configuration.");
  }
});

// API to render and download the email template
app.get("/renderAndDownloadTemplate", async (req, res) => {
  fs.readFile("./layout.html", "utf8", async (err, layout) => {
    if (err) return res.status(500).send("Error reading layout file.");

    try {
      const db = client.db(dbName);
      const collection = db.collection("emailConfigs");

      const config = await collection.findOne({}, { sort: { _id: -1 } }); // Fetch the latest config
      if (!config) return res.status(404).send("No email configuration found.");

      // Replace placeholders with actual data
      const renderedTemplate = layout
        .replace("{{title}}", config.title || "")
        .replace("{{content}}", config.content || "")
        .replace("{{footer}}", config.footer || "")
        .replace("{{imageUrl}}", config.imageUrl || "");

      res.setHeader("Content-Type", "text/html");
      res.send(renderedTemplate);
    } catch (err) {
      console.error(`Error fetching email configuration: ${err}`);
      res.status(500).send("Error rendering template.");
    }
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
