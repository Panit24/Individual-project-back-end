const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const createError = require("../utils/createError");
const {
  SaleOrder,
  SaleOrderProduct,
  Product,
  sequelize,
  Category,
  CartProduct,
} = require("../models");

exports.createSaleOrderAndSaleOrderProducts = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const {
      deliveryType,
      recipientName,
      recipientPhoneNumber,
      deliveryAddress,
      deliveryDistrict,
      deliveryCity,
      deliveryPostCode,
      paymentType,
      image,
    } = req.body;
    if (!paymentType) {
      createError("โปรดกรุณาเลือกวิธีการชำระ", 400);
    }
    let slip;
    if (paymentType === "transfer") {
      if (!req.file) {
        createError("โปรดกรุณาอัพโหลด slip pay-in", 400);
      }
      if (req.file) {
        const result = await cloudinary.upload(req.file.path);
        slip = result.secure_url;
      }
    }
    if (
      paymentType === "cash on store" ||
      paymentType === "cash on delivery" ||
      "transfer"
    ) {
      const cartProducts = await CartProduct.findAll({
        include: [
          {
            model: Product,
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "description",
                "stock",
                "categoryId",
                "supplierId",
              ],
            },
          },
        ],
        where: { userId: req.user.id },
        attributes: { exclude: ["createdAt", "updatedAt", "id"] },
      });
      let netPrice = 0;
      cartProducts.forEach((element) => {
        netPrice = netPrice + element.amount * +element.Product.unitPrice;
      });
      let netWeight = 0;
      cartProducts.forEach((element) => {
        netWeight = netWeight + element.amount * +element.Product.unitWeightKg;
      });
      let resArr = [];

      await Promise.all(
        cartProducts.map(async (el) => {
          const product = await Product.findOne({
            where: { id: el.productId },
          });
          if (el.amount > product.stock) {
            createError(`product ${product.name} มีไม่เพียงพอ`, 400);
          }
        })
      );

      const saleOrder = await SaleOrder.create(
        {
          deliveryType: deliveryType,
          recipientName: recipientName,
          recipientPhoneNumber: recipientPhoneNumber,
          deliveryAddress: deliveryAddress,
          deliveryDistrict: deliveryDistrict,
          deliveryCity: deliveryCity,
          deliveryPostCode: deliveryPostCode,
          paymentType: paymentType,
          userId: req.user.id,
          slip: slip,
          netPrice: netPrice,
          netWeight: netWeight,
        },
        { transaction: t }
      );

      cartProducts.forEach((el) => {
        resArr.push({
          amount: el.amount,
          productId: el.productId,
          unitPrice: el.Product.unitPrice,
          unitWeightKg: el.Product.unitWeightKg,
          saleOrderId: saleOrder.id,
        });
      });
      //   console.log(resArr);
      //---------------------------

      const saleOrderProducts = await SaleOrderProduct.bulkCreate(resArr, {
        transaction: t,
      });
      //   function deleteCartOrderByUserId()
      await CartProduct.destroy(
        { where: { userId: req.user.id } },
        { transaction: t }
      );
      // function updateProductByProductId()
      const promise = saleOrderProducts.map(async (el) => {
        const product = await Product.findOne({ where: { id: el.productId } });
        // console.log(product);
        // console.log(el);
        product.stock = product.stock - el.amount;
        await product.save({ transaction: t });
      });
      await Promise.all(promise);
      //await = รอ
      //resolve reject
      //เปิด connection 3 ตัว
      //Promise.all(promise) = ให้ promise objects ทุกตัวทำงานเสร็จก่อนแล้วค่อย commit
      //---------------------------
      // res.json({ saleOrder: saleOrder });
      await t.commit();
      res.json({ saleOrderProducts: saleOrderProducts });
    }
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
exports.getSaleOrderByUserId = async (req, res, next) => {
  try {
    const saleOrders = await SaleOrder.findAll({
      include: [
        {
          model: SaleOrderProduct,
          attributes: {
            exclude: ["updatedAt"],
          },
          include: [
            {
              model: Product,
              attributes: {
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "description",
                  "stock",
                  "categoryId",
                  "supplierId",
                ],
              },
            },
          ],
        },
      ],
      where: { userId: req.user.id },
    });
    if (saleOrders.length === 0) {
      createError("Sale order not found", 400);
    }
    res.json({ saleOrders: saleOrders });
  } catch (err) {
    next(err);
  }
};
