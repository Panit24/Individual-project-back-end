const express = require("express");
const saleOrderController = require("../controllers/saleOrderController");
const upload = require("../middleware/upload");
const router = express.Router();
router.post(
  "/createSaleOrderAndSaleOrderProducts",
  upload.single("slip"),
  saleOrderController.createSaleOrderAndSaleOrderProducts
);
router.get("/getSaleOrderByUserId", saleOrderController.getSaleOrderByUserId);

module.exports = router;
