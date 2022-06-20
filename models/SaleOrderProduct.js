module.exports = (sequelize, DataTypes) => {
  const SaleOrderProduct = sequelize.define(
    "SaleOrderProduct",
    {
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      discount: DataTypes.FLOAT,
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      unitWeightKg: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      underscored: true,
    }
  );
  SaleOrderProduct.associate = (models) => {
    SaleOrderProduct.belongsTo(models.Product, {
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    SaleOrderProduct.belongsTo(models.SaleOrder, {
      foreignKey: {
        name: "saleOrderId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };
  return SaleOrderProduct;
};
