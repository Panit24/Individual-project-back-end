const { CartProduct, sequelize, Product } = require("../models");
const createError = require("../utils/createError");
exports.addCartProduct = async (req, res, next) => {
  try {
    const { amount, productId } = req.body;
    if (!amount) {
      createError("Amount is required", 400);
    }
    if (!productId) {
      createError("Product id is required", 400);
    }
    const cartProduct = await CartProduct.create({
      amount: amount,
      productId: productId,
      userId: req.user.id,
    });
    res.json({ cartProduct: cartProduct });
  } catch (err) {
    next(err);
  }
};
exports.deleteCartProduct = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { cartProductId } = req.params;

    const cartProduct = await CartProduct.findOne({
      where: {
        id: cartProductId,
      },
    });
    if (!cartProduct) {
      createError("Cart product not found", 400);
    }
    if (cartProduct.userId !== req.user.id) {
      createError("You have no permission", 403);
    }
    await CartProduct.destroy(
      { where: { id: cartProductId } },
      { transaction: t }
    );
    await t.commit();
    res.status(204).json();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
exports.updateCartProduct = async (req, res, next) => {
  try {
    const { cartProductId } = req.params;
    const { amount } = req.body;
    const cartProduct = await CartProduct.findOne({
      where: { id: cartProductId },
    });
    if (!cartProduct) {
      createError("Cart product not found", 400);
    }
    if (cartProduct.userId !== req.user.id) {
      createError("You have no permission", 403);
    }
    const product = await Product.findOne({
      where: { id: cartProduct.productId },
    });
    // console.log(cartProduct.productId);
    // console.log(product.stock);
    if (amount > product.stock) {
      createError("สินค้ามีไม่เพียงพอ", 400);
    } else {
      cartProduct.amount = amount;
    }
    await cartProduct.save();
    res.json({ cartProduct: cartProduct });
  } catch (err) {
    next(err);
  }
};
exports.getCartProductById = async (req, res, next) => {
  try {
    const { cartProductId } = req.params;
    const cartProduct = await CartProduct.findOne({
      where: { id: cartProductId },
      attributes: { exclude: ["createdAt", "updatedAt", "id"] },
    });
    if (!cartProduct) {
      createError("Cart product not found", 400);
    }
    if (cartProduct.userId !== req.user.id) {
      createError("You have no permission", 403);
    }
    res.json({ cartProduct: cartProduct });
  } catch (err) {
    next(err);
  }
};
exports.getCartProductByUserId = async (req, res, next) => {
  try {
    const cartProducts = await CartProduct.findAll({
      where: { userId: req.user.id },
      attributes: { exclude: ["createdAt", "updatedAt", "id"] },
    });
    if (!cartProducts) {
      createError("Cart product not found", 400);
    }
    if (cartProducts[0].userId !== req.user.id) {
      createError("You have no permission", 403);
    }
    res.json({ cartProducts: cartProducts });
  } catch (err) {
    next(err);
  }
};
