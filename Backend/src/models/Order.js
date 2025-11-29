const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
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
  mongoose.models.order || mongoose.model("order", orderSchema, "orders");
