const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const createError = require("../utils/createError");
const { Product, sequelize, Category } = require("../models");

exports.addProduct = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    //Function purchase updateStock by productId
    const { productCode, amount } = req.body;
    const existingProduct = await Product.findOne({
      where: { productCode: productCode },
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "description",
          "categoryId",
          "supplierId",
          "unitWeightKg",
          "image",
        ],
      },
    });

    // console.log(existingProduct);

    if (existingProduct) {
      existingProduct.stock = existingProduct.stock + +amount;
      await existingProduct.save({ transaction: t });
      await t.commit();
      res.json({ existingProduct: existingProduct });
    } else {
      const {
        name,
        unitPrice,
        productCode,
        stock,
        unitWeightKg,
        productCategory,
        categoryId,
        description,
      } = req.body;
      if (!req.file && !name) {
        createError(" Image or product name is required", 400);
      }
      let image;
      if (req.file) {
        const result = await cloudinary.upload(req.file.path);
        image = result.secure_url;
        const product = await Product.create({
          name,
          image,
          unitPrice,
          productCode,
          stock,
          unitWeightKg,
          productCategory,
          categoryId,
          description,
        });
      }
      const product = await Product.create(
        {
          name,
          image,
          unitPrice,
          productCode,
          stock,
          unitWeightKg,
          productCategory,
          categoryId,
        },
        { transaction: t }
      );
      await t.commit();
      res.json({ product: product });
    }
    //------------------
    // const promise = saleOrderProducts.map(async (el) => {
    //   const product = await Product.findOne({ where: { id: el.productId } });
    // console.log(product);
    // console.log(el);
    //   product.stock = product.stock - el.amount;
    //   await product.save({ transaction: t });
    // });
    // await Promise.all(promise);
    //------------------
  } catch (err) {
    await t.rollback();
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
exports.deleteProduct = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { productId } = req.params;

    const product = await Product.findOne({
      where: {
        id: productId,
      },
    });
    if (!product) {
      createError("product not found", 400);
    }
    await Product.destroy({ where: { id: productId } }, { transaction: t });
    if (product.image) {
      const splited = product.image.split("/");
      const publicId = splited[splited.length - 1].split(".")[0];
      await cloudinary.destroy(publicId);
    }
    await Product.destroy({ where: { id: productId } }, { transaction: t });
    await t.commit();
    res.status(204).json();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
exports.updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { price } = req.body;
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      createError("product not found", 400);
    }
    if (req.file) {
      if (product.image) {
        const splited = product.image.split("/");
        const publicId = splited[splited.length - 1].split(".")[0];
        await cloudinary.destroy(publicId);
      }
      const result = await cloudinary.upload(req.file.path);
      product.image = result.secure_url;
    }

    if (price) {
      product.price = price;
    }

    await product.save();

    res.json({ updatedProduct: product });
  } catch (err) {
    next(err);
  }
};
