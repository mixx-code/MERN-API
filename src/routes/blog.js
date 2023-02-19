const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const blogController = require("../controllers/blog");
//[POST]: /v1/blog/post
router.post(
  "/post",
  [
    body("title").isLength({ min: 5 }).withMessage("Input Title tidak sesuai"),
    body("body").isLength({ min: 5 }).withMessage("Input body tidak sesuai"),
  ],
  blogController.createBlogPost
);

//[GET]: /v1/blog/posts

router.get("/posts", blogController.getAllBlogPost); // --> untuk mengambil semua data

router.get("/post/:postId", blogController.getBlogPostById);

module.exports = router;
