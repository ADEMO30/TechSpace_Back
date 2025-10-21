const express = require("express");
const {
  addProduct,
  getAllProduct,
  getOneProduct,
  deleteProduct,
  editProduct,
  searchProducts, // <-- import this from your controller
} = require("../controllers/product");

const router = express.Router();

// add product
router.post("/addproduct", addProduct);

// Search for product - place BEFORE /:id route
router.get("/search", searchProducts);

// get all product
router.get("/getProducts", getAllProduct);

// get one product
router.get("/:id", getOneProduct);

// delete product
router.delete("/:_id", deleteProduct);

// edit product
router.put("/:_id", editProduct);

module.exports = router;