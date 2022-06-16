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
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      deliveryType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      recipientName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      recipientPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      deliveryAddress: {
        type: DataTypes.TEXT,
      },
      deliveryDistrict: {
        type: DataTypes.STRING,
      },
      deliveryCity: {
        type: DataTypes.STRING,
      },
      deliveryPostCode: {
        type: DataTypes.STRING,
      },
      deliveryLocation: {
        type: DataTypes.STRING,
      },
      deliveryStatus: {
        type: DataTypes.ENUM(
          "กำลังดำเนินการ",
          "พร้อมส่ง",
          "กำลังส่ง",
          "ส่งเสร็จสิ้น"
        ),
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
