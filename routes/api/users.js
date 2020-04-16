const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
//Item Model.. we need thsi to make queries like Item.find and save...
const User = require("../../models/User");
const config = require("config");
const jwt = require("jsonwebtoken");

// @route  POST api/users
// @desc   Register new user
// @access Public
//instead of app.get in the server.js file we  use:
router.post("/", (req, res) => {
  //pull out some variables out of req.body with destructuring
  const { name, email, password } = req.body;

  //Simple vallidation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "please enter all fields" });
  }

  // Check for existing user in the user model
  User.findOne({ email: email }).then(user => {
    if (user) return res.status(400).json({ msg: "User already exists" });

    const newUser = new User({
      name,
      email,
      password
    });

    // create a salt and hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          //ultimately we generate a token and send a toke n and the user
          .then(user => {
            // this way when we send a token from react or postman or wherever, the user id is in there so that it knows which user it is. otherwise any token could access amything.
            // jwt.sign(payload, secretOrPrivateKey, [options, callback])
            jwt.sign(
              { id: user.id },
              config.get("jwtSecret"),
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token: token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                  }
                });
              }
            );
          });
      });
    });
  });
  //res.send("register");
});

module.exports = router;
