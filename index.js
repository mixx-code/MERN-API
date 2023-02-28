const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const app = express();
const authRoutes = require("./src/routes/auth");
const blogRoutes = require("./src/routes/blog");

const port = process.env.PORT || 4000;
const database =
  process.env.MONGO_URI ||
  "mongodb+srv://rizki:kJl7aR5ADDvW2IFs@cluster0.hiuv4fm.mongodb.net/blog?retryWrites=true&w=majority";
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = new Date().getTime();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

app.use(bodyParser.json()); //type JSON
//middleware untuk mengizikan akses ke folder image
app.use("/images", express.static(path.join(__dirname, "images")));

//middleware untuk upload image
app.use(upload.single("image"));
//eror cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//GET '/users' ==> [{nama: Rizki}]
app.use("/v1/blog", blogRoutes);
app.use("/v1/auth", authRoutes);

app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(database, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(port, () => console.log("connection success"));
  })
  .catch((err) => console.log(err));
mongoose.connection.on("connected", () =>
  console.log(`${database}, terkoneksi....`)
);
