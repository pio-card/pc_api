const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
//Item Model.. we need thsi to make queries like Item.find and save...
const Item = require("../../models/item");

// @route  GET api/items
// @desc   Get All Items
// @access Public
//instead of app.get in the server.js file we  use:
router.get("/", (req, res) => {
  //take the model and use the find method to return a promise. SOrt it descending, then return the response in json format.
  Item.find()
    .sort({ date: -1 })
    .then(items => res.json(items));
});

// @route  POST api/items
// @desc   Create an Items
// @access Private(because of auth parameter)
router.post("/", auth, (req, res) => {
  //we construct an object to insert into the database. If it was a post or product model then it would be Post or Product or whatever. All we need is the name which comes inside the body of the request.. body-parser allows us to neatly take that with the below command
  const newItem = new Item({
    name: req.body.name
  });

  //the Item is for now only in memory so we save the new Item onto the database, and the promise based return spits out the item//this item gets sent by the addItem Action
  newItem.save().then(item => res.json(item));
});

// @route  DELETE api/items/:id
// @desc   Dekete an Item
// @access Private(because of auth parameter)
router.delete("/:id", auth, (req, res) => {
  //fetch the id from the URI with req.params.id,
  Item.findById(req.params.id)
    //pass in the item we are searching for and then remove it, gives promise in which we put in a callback, we can return any response in that callback.
    .then(item => item.remove().then(() => res.json({ success: true })))
    //we wanna send back a response with a status
    .catch(err => res.status(404).json({ success: false }));
});

//the Item is for now only in memory so we save the new Item onto the database, and the promised based retorun spits out the item

module.exports = router;
