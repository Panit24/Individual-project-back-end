const express = require("express");
const saleOrderController = require("../controllers/saleOrderController");
const upload = require("../middleware/upload");
const router = express.Router();
router.post(
  "/createSaleOrderAndSaleOrderProducts",
  upload.single("slip"),
  saleOrderController.createSaleOrderAndSaleOrderProducts
);
module.exports = router;
