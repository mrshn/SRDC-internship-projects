const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema
let User = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
    },
    birthdate: {
        type: Date,
    },
    privilege: {
      type: Number,
    },
  },
  {
    collection: "users",
  }
);

module.exports = mongoose.model("User", User);
