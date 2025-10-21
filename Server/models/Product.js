// models/Product.js

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },             // Product name
  price: { type: Number, required: true },            // Current price
  oldPrice: { type: Number },                         // Old price (optional)
  discount: { type: String },                         // Discount label (e.g. "-20%")
  image: { type: String, required: true },            // Product image URL
  description: { type: String },                      // Optional for ProductDetails page
  createdAt: { type: Date, default: Date.now }        // Optional timestamp
});

module.exports = model("product", productSchema);
