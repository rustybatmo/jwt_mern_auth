const jwt = require("jsonwebtoken");
const Product = require("../models/productModel");

const auth = (req, res, next) => {
  try {
    // const { name, price } = req.body;
    const token = req.cookies.token;

    if (!token) {
      res.send({ errorMessage: "Unauthorized" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified.user;
    next();
  } catch (err) {
    res.send({ errorMessage: "Unauthorized" });
  }
};

module.exports = auth;
