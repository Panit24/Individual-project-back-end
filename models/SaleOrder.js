module.exports = (sequelize, DataTypes) => {
  const SaleOrder = sequelize.define(
    "SaleOrder",
    {
      netPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      netWeight: { type: DataTypes.FLOAT, allowNull: false },
      slip: { type: DataTypes.STRING },
      paymentType: {
        type: DataTypes.STRING,
        defaultValue: "transfer",
      },
      deliveryType: {
        type: DataTypes.STRING,
      },
      recipientName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      recipientPhoneNumber: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      deliveryAddress: {
        type: DataTypes.TEXT,
      },
      deliveryDistrict: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      deliveryCity: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      deliveryPostCode: {
        type: DataTypes.STRING,
      },
      deliveryLocation: {
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
  SaleOrder.associate = (models) => {
    SaleOrder.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    SaleOrder.hasMany(models.SaleOrderProduct, {
      foreignKey: {
        name: "saleOrderId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };
  return SaleOrder;
};
