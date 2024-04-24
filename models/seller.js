const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SellerSchema = new Schema({
  photo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: Schema.Types.Mixed, // Accepts both String and Number
    required: true,
  },
});

const Seller = mongoose.model("Seller", SellerSchema);
module.exports = Seller;
