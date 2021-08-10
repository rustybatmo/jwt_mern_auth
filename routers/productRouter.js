const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const Product = require("../models/productModel");

router.post("/add_product", auth, async (req, res) => {
  try {
    const { name, price } = req.body;
    const newProduct = new Product({
      name,
      price,
    });
    const savedProduct = await newProduct.save();

    res.send("User is logged in. Product is created" + savedProduct);
  } catch (err) {
    res.json({ errorMessage: "User is not logged in. Can't add product" });
  }
});

module.exports = router;
