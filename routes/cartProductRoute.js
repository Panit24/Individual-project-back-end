const express = require("express");
const cartProductController = require("../controllers/cartProductController");
const router = express.Router();
router.post("/add", cartProductController.addCartProduct);
router.delete(
  "/delete/:productId",
  cartProductController.deleteCartProductByProductId
);
router.patch("/update/:cartProductId", cartProductController.updateCartProduct);
router.get(
  "/getByCartProductId/:cartProductId",
  cartProductController.getCartProductById
);
router.get("/getByUserId", cartProductController.getCartProductByUserId);
// router.get(
//   "/getCartProductNetPrice",
//   cartProductController.getCartProductNetPriceByUserId
// );
router.get("/amount", cartProductController.getCartProductAmountByUserId);

module.exports = router;
