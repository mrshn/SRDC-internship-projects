const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema
let Message = new Schema(
  {
    sender: {
      type: String,
    },
    reciever: {
      type: String,
    },
    title: {
      type: String,
    },
    message:{
        type: String,
    },
    date:{
      type: Date,
    },
    availability:{
      type: Number,
    },
  },
  {
    collection: "messages",
  }
);

module.exports = mongoose.model("Message", Message);
