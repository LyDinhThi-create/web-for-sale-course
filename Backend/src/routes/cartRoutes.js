const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");

router.get("/", cartController.getAllCart);
router.post("/add/:courseId", cartController.addCourseCart);
router.post("/delete/:courseId", cartController.deleteCourseCart);

module.exports = router;
