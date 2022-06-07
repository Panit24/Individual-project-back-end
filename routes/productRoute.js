const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

router.get("/getProductById/:productId", productController.getProductById);
router.get(
  "/getAllProductByCategoryName/:categoryName",
  productController.getAllProductByCategoryName
);

module.exports = router;
