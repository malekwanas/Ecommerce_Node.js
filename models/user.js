const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  photo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  Country: {
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

const User = mongoose.model("User", UserSchema);
module.exports = User;
