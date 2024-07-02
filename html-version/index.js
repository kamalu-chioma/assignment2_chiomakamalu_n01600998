require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const exphbs = require("express-handlebars");

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
  })
);

app.set("view engine", ".hbs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("uploads"));

// Routes
app.get("/", (req, res) => {
  res.render("home", { title: "Home Page" });
});

app
  .route("/upload")
  .get((req, res) => {
    res.render("upload", { title: "Upload Single File" });
  })
  .post(upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    res.send(`File uploaded successfully: ${req.file.path}`);
  });

app
  .route("/upload-multiple")
  .get((req, res) => {
    res.render("upload-multiple", { title: "Multiple Image Uploader" });
  })
  .post(upload.array("files", 100), (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }
    const filePaths = req.files.map((file) => file.path);
    res.status(200).send(`Files uploaded successfully: ${filePaths.join(", ")}`);
  });

app.get("/fetch-single", (req, res) => {
  let upload_dir = path.join(__dirname, "uploads");
  let uploads = fs.readdirSync(upload_dir);

  if (uploads.length == 0) {
    return res.status(503).send({
      message: "No images",
    });
  }

  let max = uploads.length - 1;
  let min = 0;
  let index = Math.round(Math.random() * (max - min) + min);
  let randomImage = uploads[index];

  res.sendFile(path.join(upload_dir, randomImage));
});

app.get("/fetch-multiple", (req, res) => {
  let upload_dir = path.join(__dirname, "uploads");
  let uploads = fs.readdirSync(upload_dir);

  if (uploads.length == 0) {
    return res.status(503).send({
      message: "No images",
    });
  }

  let numImages = parseInt(req.query.num) || 1;
  if (numImages > uploads.length) {
    numImages = uploads.length;
  }

  let shuffled = uploads.sort(() => 0.5 - Math.random());
  let selectedImages = shuffled.slice(0, numImages);

  res.json(selectedImages);
});

app.get("/multiple", (req, res) => {
  res.render("multiple", { title: "Fetch Multiple Random Images" });
});

// Other routes (fetch all, gallery, etc.) will be defined here

// Catch-all route
app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
