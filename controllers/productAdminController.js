const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const createError = require("../utils/createError");
const { Product, sequelize } = require("../models");

exports.addNewProduct_UpdateStockAndPriceOfOldProduct_ByProductCodeAndProductId =
  async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      // const {
      //   name,
      //   unitPrice,
      //   productCode,
      //   amount,
      //   unitWeightKg,
      //   categoryId,
      //   description,
      //   id,
      // } = req.body;
      //Function purchase updateStock by productId
      const { products } = req.body;
      // console.log(products);

      let productsObj = { products: JSON.parse(products) };
      console.log(productsObj);
      // if (req.file) {
      // if (!req.file && !name) {
      //   createError(" Image or product name is required", 400);
      // }
      let image;
      if (req.file) {
        const result = await cloudinary.upload(req.file.path);
        image = result.secure_url;
      }
      if (productsObj.products) {
        const promise = productsObj.products.map(async (el) => {
          //หาว่ามีของเก่าไหม
          const product = await Product.findOne({
            where: { productCode: el.productCode },
          });
          //ถ้ามีของเก่าก็ update
          if (product) {
            product.stock = product.stock + el.amount;
            product.unitPrice = el.unitPrice;
            product.name = el.name;
            await product.save({ transaction: t });
          }
          //ถ้าไม่มีของเก่าก็ create
          if (!product) {
            //if product not found
            const product = await Product.create(
              {
                name: el.name,
                unitPrice: el.unitPrice,
                unitWeightKg: el.unitWeightKg,
                description: el.description,
                productCode: el.productCode,
                stock: el.amount,
                categoryId: el.categoryId,
                image: image || null,
              },
              { transaction: t }
            );
          }
        });
        const res = await Promise.all(promise);
        console.log(res);
      }
      //--------------------------------------------------------
      //--------------------------------------------------------
      await t.commit();
      res.json({ message: "เพิ่มสินค้าสำเร็จ" });
      //----------------------------------------------------------
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
      product.unitPrice = price;
    }

    await product.save();

    res.json({ updatedProduct: product });
  } catch (err) {
    next(err);
  }
};
