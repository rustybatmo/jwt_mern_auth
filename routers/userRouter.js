const router = require("express").Router();
const User = require("../models/userModel");
const becrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register
router.post("/register", async (req, res) => {
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
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

//logging in users

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //validation
  if (!email || !password) {
    res.send("Please enter both the fields");
  }

  const userExisting = await User.findOne({
    email,
  });
  if (!userExisting) {
    res.send("Wrong email or password");
  }

  const passwordCorrect = await becrypt.compare(
    password,
    userExisting.passwordHash
  );

  if (!passwordCorrect) {
    res.send("Wrong email or password");
  }

  const token = jwt.sign({ user: userExisting._id }, process.env.JWT_SECRET);
  console.log("this is the token", token);
  res.cookie("token", token, { httpOnly: true }).send("Token sent back");

  // const token = jwt.sign({user: })

  console.log(email + "  " + password);
});

router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});

module.exports = router;
