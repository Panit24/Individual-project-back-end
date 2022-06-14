const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

router.get("/getProductById/:productId", productController.getProductById);
router.get(
  "/getAllProductByCategoryName/:categoryName",
  productController.getAllProductByCategoryName
);
router.get(
  "/getAllProductBySearchTerm/:searchTerm",
  productController.getAllProductBySearchTerm
);

module.exports = router;
