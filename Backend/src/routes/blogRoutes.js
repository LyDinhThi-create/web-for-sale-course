const express = require("express");
const { getAllBlog, getBlogById } = require("../controllers/blogController");

const router = express.Router();

router.get("/", getAllBlog);
router.get("/:id", getBlogById);

module.exports = router;
