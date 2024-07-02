// n01600998
// chioma kamalu
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
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
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Ensure this line is present

// Routes
app.get("/", (req, res) => {
  res.render("home", { title: "Home Page" });
});

app.get("/single", (req, res) => {
  res.render("single", { title: "Fetch Random Image" });
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

  console.log(selectedImages);  // Log the selected image paths
  res.json(selectedImages);
});

app.get("/multiple", (req, res) => {
  res.render("fetch-multiple", { title: "Fetch Multiple Random Images" });
});

app.get("/fetch-all", (req, res) => {
  let upload_dir = path.join(__dirname, "uploads");
  let uploads = fs.readdirSync(upload_dir);

  if (uploads.length == 0) {
    return res.status(503).send({
      message: "No images",
    });
  }

  res.json(uploads);
});

app.get("/gallery", (req, res) => {
  res.render("gallery", { title: "Image Gallery" });
});

app.get("/fetch-all-pagination/pages/:page", (req, res) => {
  const upload_dir = path.join(__dirname, "uploads");
  const uploads = fs.readdirSync(upload_dir);

  if (uploads.length == 0) {
    return res.status(503).send({
      message: "No images",
    });
  }

  const itemsPerPage = 10; // Number of images per page
  const page = parseInt(req.params.page) || 1;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const paginatedImages = uploads.slice(start, end);
  const totalPages = Math.ceil(uploads.length / itemsPerPage);

  res.json({
    images: paginatedImages,
    currentPage: page,
    totalPages: totalPages,
  });
});

app.get("/gallery-pagination", (req, res) => {
  res.render("gallery-pagination", { title: "Paginated Image Gallery" });
});

// Catch-all route
app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
