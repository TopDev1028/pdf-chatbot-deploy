const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const users = require("./routes/api/users");
const dotenv = require("dotenv").config();

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

const dbURL ="mongodb://localhost:27017/mern-auth";

//connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || dbURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

var cors = require("cors");

app.use(cors()); // Use this after the variable declaration

app.use((err, req, res, next) => {
  // Check if the error is thrown from multer
  if (err instanceof multer.MulterError) {
    res.statusCode = 400;
    res.send({ code: err.code });
  } else if (err) {
    // If it is not multer error then check if it is our custom error for FILE_MISSING
    if (err.message === "FILE_MISSING") {
      res.statusCode = 400;
      res.send({ code: "FILE_MISSING" });
    } else {
      //For any other errors set code as GENERIC_ERROR
      res.statusCode = 500;
      res.send({ code: "GENERIC_ERROR" });
    }
  }
});

// Routes
app.use("/api/users", users);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port}`));
