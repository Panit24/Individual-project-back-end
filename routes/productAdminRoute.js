const express = require("express");
const productAdminController = require("../controllers/productAdminController");
const upload = require("../middleware/upload");
const router = express.Router();
router.post(
  "/add",
  upload.single("image"),
  productAdminController.addNewProduct_UpdateStockAndPriceOfOldProduct_ByProductCodeAndProductId
);
router.delete("/del/:productId", productAdminController.deleteProduct);
router.patch(
  "/update/:productId",
  upload.single("image"),
  productAdminController.updateProduct
);
module.exports = router;
