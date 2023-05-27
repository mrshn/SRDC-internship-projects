const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authenticate = require("./routesHelpers/authenticate");
const messageRoute = express.Router();
let Message = require("../models/Message");
let User = require("../models/User");

messageRoute.route("/getInbox").get(authenticate, (req, res) => {
  const query = new Object();
  query.reciever = req.user.username;
  query.availability = { $ne: 1 };
  Message.find(query, "-__v", (error, data) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Server error occured");
    } else {
      return res.status(200).json(data);
    }
  });
});

messageRoute.route("/getOutbox").get(authenticate, (req, res) => {
  const query = new Object();
  query.sender = req.user.username;
  query.availability = { $ne: 2 };
  Message.find(query, "-__v", (error, data) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Server error occured");
    } else {
      return res.status(200).json(data);
    }
  });
});

messageRoute.route("/sendMessage").post(authenticate, (req, res) => {
  req.body.sender = req.user.username;
  req.body.date = new Date();
  req.body.availability = 0;

  User.findOne({ username: req.body.reciever }, (error, data) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Server error occured");
    } else if (data) {
      Message.create(req.body, (error) => {
        if (error) {
          console.log(error);
          return res.status(500).send("Server error occured");
        } else {
          return res.status(201).json({ response: "Message is sent" });
        }
      });
    } else {
      return res.status(202).send("User does not exist");
    }
  });
});

messageRoute.route("/getMessageId/:id").get(authenticate, (req, res) => {
  if (req.params.id.length !== 24) {
    return res.status(400).send("Bad request");
  }
  Message.findById(req.params.id, "-__v", (error, data) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Server error occured");
    } else if (data) {
      res.json(data);
    } else {
      return res.status(202).send("Message is not found!");
    }
  });
});

messageRoute.route("/deleteMessage/:id").delete(authenticate, (req, res) => {
  const updatedMessage = new Object();
  if (req.params.id.length !== 24) {
    return res.status(400).send("Bad request");
  }
  Message.findById(req.params.id, "-__v", (error, data) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Server error occured");
    } else if (data) {
      if (
        req.user.username !== data.sender &&
        req.user.username !== data.reciever
      ) {
        return res.status(403).send("THIS IS NOT YOUR MESSAGE");
      }
      if (data.availability === 1) {
        if (req.user.username === data.sender) {
          Message.findByIdAndDelete(req.params.id).then();
          return res.json({});
        }
        if (req.user.username === data.reciever) {
          return res.json({});
        }
      }
      if (data.availability === 2) {
        if (req.user.username === data.reciever) {
          Message.findByIdAndDelete(req.params.id).then();
          return res.json({});
        }
        if (req.user.username === data.sender) {
          return res.json({});
        }
      }
      if (req.user.username === data.sender) {
        updatedMessage.availability = 2;
      }
      if (req.user.username === data.reciever) {
        updatedMessage.availability = 1;
      }
      Message.findByIdAndUpdate(
        req.params.id,
        updatedMessage,
        { new: true },
        (error, data) => {
          if (error) {
            console.log(error);
            return res.status(500).send("Server error occured");
          } else if (data) {
            return res.json({});
          } else {
            return res.status(400).send("Message does not exist");
          }
        }
      );
    } else {
      return res.status(202).send("Message is not found!");
    }
  });
});

module.exports = messageRoute;
