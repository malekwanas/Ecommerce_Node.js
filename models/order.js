const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
