const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    name: String,
    avatar: String,
    status: String,
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);
module.exports =
  mongoose.models.User || mongoose.model("User", blogSchema, "users");
