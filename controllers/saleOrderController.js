// const fs = require("fs");
// const cloudinary = require("../utils/cloudinary");
// const createError = require("../utils/createError");
// const {
//   SaleOrder,
//   SaleOrderProduct,
//   Product,
//   sequelize,
//   Category,
// } = require("../models");

// exports.addCardProductsToSaleOrder = async (req, res, next) => {
//   try {
//   } catch (err) {
//     next(err);
//   } finally {
//   }
// };
// exports.getSaleOrderById = async (req, res, next) => {
//   try {
//     const { saleOrderId } = req.params;
//     const saleOrder = await SaleOrder.findOne({ where: { id: saleOrderId } });
//     if (!saleOrder) {
//       createError("Sale order not found", 400);
//     }
//     res.json({ saleOrder: saleOrder });
//   } catch (err) {
//     next(err);
//   }
// };
