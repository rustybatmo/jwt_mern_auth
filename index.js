const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//this takes the .env file in the root during runtime and creates a "process.env" environment variable
dotenv.config();

//set up server

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT} `));

//parsing incoming json into object
app.use(express.json());
app.use(cors());

//connect to mongoDB

mongoose.connect(
  process.env.MDB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log("there is an error: " + err);
      return;
    }
    console.log("Connected to mongoDB");
  }
);

app.get("/home", (req, res) => {
  res.send("This is the home page");
});

app.use(cookieParser());

app.use("/auth", require("./routers/userRouter"));
app.use("/", require("./routers/productRouter"));
