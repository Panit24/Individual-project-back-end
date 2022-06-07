const express = require("express");
const productAdminController = require("../controllers/productAdminController");
const upload = require("../middleware/upload");
const router = express.Router();
router.post("/add", upload.single("image"), productAdminController.addProduct);
router.delete("/:productId", productAdminController.deleteProduct);
router.patch(
  "/:productId",
  upload.single("image"),
  productAdminController.updateProduct
);
module.exports = router;
