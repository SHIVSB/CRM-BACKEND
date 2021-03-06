const serverConfig = require("./configs/server.config");
const dbConfig = require("./configs/db.config");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const express = require("express");
const logger = require("morgan");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));

/**
 * DB Connection initialization
 */

mongoose.connect(
  dbConfig.DB_URL,
  () => {
    console.log("connected to Mongo DB ");
    init();
  },
  (err) => {
    console.log("Error :", err.mssage);
  }
);

/**
 *
 * @returns
 * This method is for the demonstration purpose,
 * ideally one ADMIN user should have been created in the backend
 */
async function init() {
  var user = await User.findOne({ userId: "admin" });

  if (user) {
    console.log("Admin user already present");
    return;
  }

  try {
    user = await User.create({
      name: "Shivanshu",
      userId: "admin", // It should be atleat 16, else will throw error
      email: "shiv@game.com", // If we don't pass this, it will throw the error
      userType: "ADMIN",
      password: bcrypt.hashSync("shivanshu", 8), //this field should be hidden from the end user
    });
    console.log(user);
  } catch (e) {
    console.log(e.message);
  }
}

/**
 * importing the routes
 */
require("./routes/auth.routes")(app);
require('./routes/user.routes')(app);

app.listen(serverConfig.PORT, () => {
  console.log(`Application started on the port num : ${serverConfig.PORT}`);
});
