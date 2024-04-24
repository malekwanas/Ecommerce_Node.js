const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  CreationDate: {
    type: Date,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
