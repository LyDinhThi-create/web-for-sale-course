const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: String,
    course: [{
        courseId: String,
    }],
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);
module.exports =
  mongoose.models.cart || mongoose.model("cart", cartSchema, "carts");
