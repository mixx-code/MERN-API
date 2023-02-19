const { validationResult } = require("express-validator");
const BlogPost = require("../models/blog");

exports.createBlogPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Input value tidak sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  // if (!req.file) {
  //   const err = new Error("Image Harus di Upload");
  //   err.errorStatus = 422;
  //   err.data = errors.array();
  //   throw err;
  // }

  const title = req.body.title;
  // const image = req.file.path;
  const body = req.body.body;

  const Posting = new BlogPost({
    title,
    // image: image,
    body,
    author: {
      uid: 1,
      name: "rizki",
    },
  });

  Posting.save()
    // .then((result) => {
    //   res.status(201).json({
    //     message: "Create Blog Post Success",
    //     data: result,
    //   });
    // })
    .then((result) => {
      res.status(201).json({
        message: "Create Blog Post Success",
        data: result,
      });
    })
    .catch((err) => console.log("err : ", err));
};
