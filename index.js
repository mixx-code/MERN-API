const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const multer = require("multer");

const app = express();
const authRoutes = require("./src/routes/auth");
const blogRoutes = require("./src/routes/blog");

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "/public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toString() + "-" + file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimytype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

app.use(bodyParser.json()); //type JSON
// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
// );
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
  .connect(
    "mongodb+srv://rizki:kJl7aR5ADDvW2IFs@cluster0.hiuv4fm.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(4000, () => console.log("connection success"));
  })
  .catch((err) => console.log(err));
