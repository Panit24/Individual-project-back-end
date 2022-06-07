require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const productAdminRouter = require("./routes/productAdminRoute");
const productRouter = require("./routes/productRoute");

const adminAuthRouter = require("./routes/adminAuthRoute");
const cartProductRouter = require("./routes/cartProductRoute");
// const saleOrderRouter = require("./routes/saleOrderRoute");

const notFoundMiddleware = require("./middleware/notFound");
const errorMiddleware = require("./middleware/error");
const authenticate = require("./middleware/authenticate");
const authenticateAdmin = require("./middleware/authenticateAdmin");

const app = express();

app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/authAdmin", adminAuthRouter);
app.use("/auth", authRouter);
app.use("/users", authenticate, userRouter);
app.use("/admin_products", authenticateAdmin, productAdminRouter);
app.use("/products", productRouter);
app.use("/cart_products", authenticate, cartProductRouter);

// app.use("/saleOrders", authenticate, saleOrderRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const { sequelize } = require("./models");
const {
  CartProduct,
  User,
  Product,
  SaleOrder,
  SaleOrderProduct,
} = require("./models");
//sequelize.sync({ force: true });
// User.sync({ alter: true });
// Product.sync({ alter: true });
// SaleOrder.sync({ alter: true });
// SaleOrderProduct.sync({ alter: true });
// sequelize.sync({ alter: true });
const port = process.env.PORT || 8000;
app.listen(port, () => console.log("server running on port:" + port));
