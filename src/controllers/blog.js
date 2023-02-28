const { validationResult } = require("express-validator");
const BlogPost = require("../models/blog");
const path = require("path");

const fs = require("fs");
const { count } = require("console");
exports.createBlogPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Input value tidak sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Image Harus di Upload");
    err.errorStatus = 422;
    err.data = errors.array();
    throw err;
  }

  const title = req.body.title;
  const image = req.file.path;
  const body = req.body.body;

  const Posting = new BlogPost({
    title,
    image: image,
    body,
    author: {
      uid: 1,
      name: "rizki",
    },
  });

  Posting.save()
    .then((result) => {
      res.status(201).json({
        message: "Create Blog Post Success",
        data: result,
      });
    })
    .catch((err) => console.log("err : ", err));
};

exports.getAllBlogPost = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 5;
  let totalItems;
  //melakukan Pagination
  BlogPost.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return BlogPost.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then((result) => {
      res.status(200).json({
        message: "Data Blog Post Berhasil Dipanggil",
        data: result,
        total_data: totalItems,
        per_page: parseInt(perPage),
        current_page: parseInt(currentPage),
      });
    })
    .catch((err) => next(err));
};

exports.getBlogPostById = (req, res, next) => {
  const postId = req.params.postId;
  BlogPost.findById(postId)
    .then((result) => {
      if (!result) {
        const error = new Error("Blog Post tidak ditemukan");
        error.errorStatus = 404;
        throw error;
      }
      res.status(200).json({
        message: "Data Blog Post berhasil Dipanggil",
        data: result,
      });
    })
    .catch((err) => next(err));
};

exports.updateBlogPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Input value tidak sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Image Harus di Upload");
    err.errorStatus = 422;
    err.data = errors.array();
    throw err;
  }

  const title = req.body.title;
  const image = req.file.path;
  const body = req.body.body;

  const postId = req.params.postId;

  BlogPost.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Blog tidak ditemukan");
        err.errorStatus = 404;
        throw err;
      }
      post.title = title;
      post.body = body;
      post.image = image;

      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Update Success",
        data: result,
      });
    })
    .catch((err) => next(err));
};

exports.deleteBlogPost = (req, res, next) => {
  const postId = req.params.postId;

  BlogPost.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Blog tidak ditemukan");
        err.errorStatus = 404;
        throw err;
      }

      //hapus image dulu
      removeImage(post.image);
      //setelah image berhasil diremove sekarang menghapus postingan nya
      return BlogPost.findByIdAndDelete(postId);

      res.status(200).json({
        message: "Hapus Blog Post Berhasil",
        data: {},
      });
    })
    .then((result) => {
      res.status(200).json({
        message: "Hapus Blog Post Berhasil",
        data: result,
      });
    })
    .catch((err) => next(err));
};

//hapus image

const removeImage = (filePath) => {
  console.log("filePath", filePath);
  console.log("dir name", __dirname);
  // ini __dirname ==> C:\Users\iMixx\OneDrive\Desktop\MERN\mern-api\src\controllers
  //keluar dua kali lalu di join dengan file Path
  //ini filePath ==> images\nama gambar
  // hasil akhirnya jadi seperti ini ==> C:\Users\iMixx\OneDrive\Desktop\MERN\mern-api\images\nama gambar
  filePath = path.join(__dirname, "../../", filePath);
  //cara remove di nodejs
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};
