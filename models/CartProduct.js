module.exports = (sequelize, DataTypes) => {
  const CartProduct = sequelize.define(
    "CartProduct",
    {
      amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      underscored: true,
    }
  );

  CartProduct.associate = (models) => {
    CartProduct.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    CartProduct.belongsTo(models.Product, {
      foreignKey: {
        name: "productId",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };

  return CartProduct;
};
