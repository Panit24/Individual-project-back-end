const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const createError = require("../utils/createError");
const { Product, sequelize, Category } = require("../models");

exports.getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      createError("product not found", 400);
    }
    res.json({ product: product });
  } catch (err) {
    next(err);
  }
};
exports.getAllProductByCategoryName = async (req, res, next) => {
  try {
    const { categoryName } = req.params;
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          where: { name: categoryName },
          attributes: { exclude: ["image", "createdAt", "updatedAt"] },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "supplierId", "categoryId"],
      },
      order: [["unitPrice", "ASC"]],
    });
    if (!products[0]) {
      createError("product not found", 400);
    }
    res.json({ products: products });
  } catch (err) {
    next(err);
  }
};
