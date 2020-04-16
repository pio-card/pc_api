//Part 1
const express = require("express");
const mongoose = require("mongoose");
//const MongoClient = require("mongodb").MongoClient;
//to deal with file paths
const path = require("path");

//where the keyfile & secret is held
const config = require("config");
//initialise express
const app = express();

app.use(express.json());

//DB CONFIG.. mlab.com/cloud.mongodb.com URI ..create the config Folder for the URI and bring it in here
const db = config.get("mongoURI");
//connnect to Mongo (Promise based)
mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("Mongo DV Connected"))
  .catch(err => console.log(err));

//new code for the new MongoDB website
// const client = new MongoClient(db, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("andrey").collection("andrey");
//   client.close();
// }, console.log("Connected..."));

//USE ROUTES: anything that goes to ap/items should refer to the items variable. Make the route files available here.
app.use("/api/items", require("./routes/api/items"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

//heroku step: If, in our node environment = production then we want to set a static folder.
if (process.env.NODE_ENV === "production") {
  //if we're in production, set static folder, so it will load client/build
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    //using the path module, then we go into client/build/index.html, this should load it as long as its hitting the api route above client/build and its in production.
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//now that we have connected to mongo we need to run our server:: create a variable for the port we are going to use. If its for heroku use an evironmental variable: process.env.PORT ..or just 5000
const port = process.env.PORT || 5000;

// now we want our app to llisten on that 'port' and take a callback
app.listen(port, () => console.log(`Server started on ${port}`));
