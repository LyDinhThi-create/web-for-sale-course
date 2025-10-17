const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    instructor: {
      name: String,
      avatar: String,
    },
    lessonsCount: Number,
    students: Number,
    duration: String,
    access: String,
    description: String,
    fullDescription: [String],
    testimonials: [String],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    curriculum: [
      {
        title: String,
        duration: String,
      },
    ],
    image: String,
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);
module.exports = mongoose.model("Course", courseSchema, "courses");
