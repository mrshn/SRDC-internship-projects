const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authenticate = require("./routesHelpers/authenticate");
const isAdmin = require("./routesHelpers/isAdmin");
const userRoute = express.Router();
let User = require("../models/User");
let Message = require("../models/Message");

userRoute.route("/login").post((req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Server error occured");
    } else if (user) {
      bcrypt.compare(password, user.password, (error, answer) => {
        if (error) {
          console.log(error);
          return res.status(500).send("Server error occured");
        } else if (answer) {
          const token = jwt.sign(
            { username: username, privilege: user.privilege },
            process.env.TOKEN_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            username: user.username,
            token: token,
            privilege: user.privilege,
          });
        } else {
          return res.status(401).send("Invalid username or password");
        }
      });
    } else {
      return res.status(401).send("Invalid username or password");
    }
  });
});

userRoute.route("/logout").post((req) => {});

userRoute.route("/addUser").post(authenticate, isAdmin, (req, res) => {
  bcrypt.hash(req.body.password, 8, (error, hash) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Server error occured");
    } else {
      req.body.password = hash;
      User.create(req.body, (error) => {
        if (error) {
          console.log(error);
          if (error.name === "MongoError" && error.code === 11000) {
            return res.status(400).send("User already exists");
          } else {
            return res.status(500).send("Server error occured");
          }
        } else {
          return res.status(201).json({});
        }
      });
    }
  });
});

userRoute.route("/registerUser").post((req, res) => {
  bcrypt.hash(req.body.password, 8, (error, hash) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Server error occured");
    } else {
      req.body.password = hash;
      User.create(req.body, (error) => {
        if (error) {
          console.log(error);
          if (error.name === "MongoError" && error.code === 11000) {
            return res.status(400).send("User already exists");
          } else {
            return res.status(500).send("Server error occured");
          }
        } else {
          return res.status(201).json({});
        }
      });
    }
  });
});

userRoute.route("/getUser/:id").get(authenticate, isAdmin, (req, res) => {
  if (req.params.id.length !== 24) {
    return res.status(400).send("Bad request");
  }
  User.findById(req.params.id, "-__v", (error, data) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Server error occured");
    } else if (data) {
      res.json(data);
    } else {
      return res.status(202).send("User is not found!");
    }
  });
});

userRoute.route("/getUsers").get(authenticate, isAdmin, (req, res) => {
  let { page, size } = req.query;
  //console.log(page);
  console.log(req.query);
  //console.log(size);
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 6;
  }
  const limit = parseInt(size);
  const skip = (page - 1) * size;

  User.find(
    {},
    "-password -__v",
    { limit: limit, skip: skip },
    (error, data) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Server error occured");
      } else {
        return res.status(200).json(data);
        //return res.status(200).json(data);
        //res.send({ page, size, data: data });
      }
    }
  );
});

userRoute.route("/getUsersTypeAhead").get(authenticate, (req, res) => {
  User.find({}, "-password -__v", (error, data) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Server error occured");
    } else {
      return res.status(200).json(data);
    }
  });
});

userRoute.route("/deleteUser/:id").delete(authenticate, isAdmin, (req, res) => {
  if (req.params.id.length !== 24) {
    return res.status(400).send("Bad request");
  }
  User.findByIdAndDelete(req.params.id, (error, data) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Server error occured");
    } else if (data) {
      const query = new Object();
      query.sender = data.username;
      query.availability = { $ne: 2 };
      Message.find(query, "-__v", (error, deletedMessageDatas) => {
        if (error) {
          console.log(error);
          return res.status(500).send("Server error occured");
        } else {
          for (var i = 0; i < deletedMessageDatas.length; i++) {
            let deletedMessageData = deletedMessageDatas[i];
            const updatedMessage = new Object();
            updatedMessage.availability = 2;
            if (deletedMessageData.availability === 1) {
              Message.findByIdAndDelete(deletedMessageData.id).then();
            } else if (deletedMessageData.availability === 0) {
              Message.findByIdAndUpdate(
                deletedMessageData.id,
                updatedMessage,
                { new: true },
                (error) => {
                  if (error) {
                    console.log(error);
                    return res.status(500).send("Server error occured");
                  }
                }
              ).then();
            }
          }
        }
      }).then();
      const query2 = new Object();
      query2.reciever = data.username;
      query2.availability = { $ne: 1 };
      Message.find(query2, "-__v", (error, deletedMessageDatas) => {
        if (error) {
          console.log(error);
          return res.status(500).send("Server error occured");
        } else {
          for (var i = 0; i < deletedMessageDatas.length; i++) {
            let deletedMessageData = deletedMessageDatas[i];
            const updatedMessage = new Object();
            updatedMessage.availability = 1;
            if (deletedMessageData.availability === 2) {
              Message.findByIdAndDelete(deletedMessageData.id).then();
            } else if (deletedMessageData.availability === 0) {
              Message.findByIdAndUpdate(
                deletedMessageData.id,
                updatedMessage,
                { new: true },
                (error) => {
                  if (error) {
                    console.log(error);
                    return res.status(500).send("Server error occured");
                  }
                }
              ).then();
            }
          }
        }
      });
      return res.status(200).json({});
    } else {
      return res.status(400).send("User does not exist");
    }
  }).then();
});

userRoute.route("/updateUser/:id").put(authenticate, isAdmin, (req, res) => {
  if (req.params.id.length !== 24) {
    return res.status(400).send("Bad request");
  }
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Server error occured");
      } else if (data) {
        Message.updateMany(
          { reciever: data.username },
          { reciever: req.body.username }
        ).exec();
        Message.updateMany(
          { sender: data.username },
          { sender: req.body.username }
        ).exec();
        return res.status(201).json({});
      } else {
        return res.status(400).send("User does not exist");
      }
    }
  );
});

module.exports = userRoute;
