const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: String,
    instructor: {
      name: String,
      avatar: String,
    },
    status: String,
    category: String,
    viewCount: Number,
    fullDescription: [String],
    image: String,
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);
module.exports =
  mongoose.models.Blog || mongoose.model("Blog", blogSchema, "blogs");
