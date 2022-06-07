const express = require("express");
const cartProductController = require("../controllers/cartProductController");
const router = express.Router();
router.post("/add", cartProductController.addCartProduct);
router.delete(
  "/delete/:cartProductId",
  cartProductController.deleteCartProduct
);
router.patch("/update/:cartProductId", cartProductController.updateCartProduct);
router.get(
  "/getByCartProductId/:cartProductId",
  cartProductController.getCartProductById
);
router.get("/getByUserId", cartProductController.getCartProductByUserId);
module.exports = router;
