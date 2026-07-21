import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    items: [ // FIX: was "itms" (typo) - controller saves as "items", so this was silently dropping order items
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
      },
    ],
    address: {
      fullName: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
    },
    totalAmount: Number,
    paymentMethod: {
      type: String,
      default: "COD",
    },
    status: {
      type: String, // FIX: was missing - Mongoose needs a "type" key, not just "default"
      default: "placed",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);