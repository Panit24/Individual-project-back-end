const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const createError = require("../utils/createError");
const { Product, sequelize, Category } = require("../models");
const { Op } = require("sequelize");

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
    if (products.length === 0) {
      createError("product not found", 400);
    }
    res.json({ products: products });
  } catch (err) {
    next(err);
  }
};
exports.getAllProductBySearchTerm = async (req, res, next) => {
  try {
    const { searchTerm } = req.params;
    const products = await Product.findAll({
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "supplierId",
          "categoryId",
          "description",
          "stock",
          "unitWeightKg",
          "unitPrice",
          "productCode",
        ],
      },
      order: [["unitPrice", "ASC"]],
      where: { name: { [Op.like]: `%${searchTerm}%` } },
    });
    if (products.length === 0) {
      createError("product not found", 400);
    }
    res.json({ products: products });
  } catch (err) {
    next(err);
  }
};
