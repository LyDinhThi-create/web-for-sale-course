const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  price: Number,
  instructor: {
    name: String,
    avatar: String,
  },
  lessons: Number,
  students: Number,
  duration: String,
  access: String,
  description: String,
  fullDescription: [String],
  testimonials: [String],
  curriculum: [
    {
      title: String,
      duration: String,
    },
  ],
  image: String,
});
module.exports = mongoose.model("Course", courseSchema, "courses");
