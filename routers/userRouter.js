const router = require("express").Router();
const User = require("../models/userModel");
const becrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const { email, password, passwordVerify } = req.body;

    //validation
    if (!email || !password || !passwordVerify) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all reuired fields" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        errorMessage: "Please enter a password of atleast 6 characters",
      });
    }
    if (password !== passwordVerify) {
      return res.status(400).json({
        errorMessage: "Please enter the same password twice",
      });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(400).json({ errorMessage: "Email address already exists" });
      return;
    }

    //hash the password
    const salt = await becrypt.genSalt();
    const passwordHash = await becrypt.hash(password, salt);
    console.log(passwordHash);

    //save the new user to the database
    const newUser = new User({
      email,
      passwordHash,
    });

    const savedUser = await newUser.save();

    //log the user in

    const token = jwt.sign({ user: savedUser._id }, process.env.JWT_SECRET);
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
    console.log(token);

    // res.send(req.body);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = router;
