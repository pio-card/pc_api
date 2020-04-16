//Login rouoting. Copy of users.js but only with user and password routing.
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
//Item Model.. we need thsi to make queries like Item.find and save...
const User = require("../../models/User");
const config = require("config");
const jwt = require("jsonwebtoken");

const auth = require("../../middleware/auth");

// @route  POST api/auth
// @desc   Register new user
// @access Public (because we have to get the token publicly and send it along to private routes)
//instead of app.get in the server.js file we  use:
router.post("/", (req, res) => {
  //pull out some variables out of req.body with destructuring
  const { email, password } = req.body;

  //Simple vallidation
  if (!email || !password) {
    return res.status(400).json({ msg: "please enter all fields" });
  }

  // prettier-ignore
  // Check if user exists (changed slightly from users.js)
  User.findOne({ email: email })
  //
  .then(user => {
      //the hash password from the database comes from user.password
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    //Validate password using a method called compare, which takes in the plain text password, and the hashed password. It returns a boolean promise.
    bcrypt.compare(password, user.password)
    .then(isMatch => {
        if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials'})
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
    })
    
  });
  //res.send("register");
});

// This will validate the user with the token
// @route  GET api/auth/user
// @desc   Get user date
// @access Private (Auth)

// prettier-ignore
//any get request to api/auth/user uses this route here
router.get("/user", auth, (req, res) => {
  //take the user model and call findById and pass in the ID from the header (req.user.id)
  User.findById(req.user.id)
    //disregard the password
    .select("-password")
    //returns a promise with the user who we want to send
    
    .then(user => res.json(user));
});

module.exports = router;
