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
