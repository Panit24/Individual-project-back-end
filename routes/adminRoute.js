const express = require("express");
const adminController = require("../controllers/adminController");
const saleOrderController = require("../controllers/saleOrderController");
const router = express.Router();
router.get("/admin", adminController.getAdmin);
router.get("/allSaleOrder", saleOrderController.getAllSaleOrder);
router.patch(
  "/updateDeliveryStatusBySaleOrderId/:saleOrderId",
  saleOrderController.updateDeliveryStatusBySaleOrderId
);

module.exports = router;
