module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      productCode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        validate: {
          notEmpty: true,
          customValidator(value) {
            if (value === null || value.length !== 8) {
              throw new Error(
                "Product code can't be empty and must have 8 characters"
              );
            }
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: { type: DataTypes.TEXT },
      unitPrice: { type: DataTypes.DECIMAL(2, 10), allowNull: false },
      stock: {
        type: DataTypes.FLOAT.UNSIGNED,
        allowNull: false,
      },
      unitWeightKg: { type: DataTypes.FLOAT, allowNull: false },
      image: { type: DataTypes.STRING, unique: true },
    },
    {
      underscored: true,
    }
  );
  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: {
        name: "categoryId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    Product.hasMany(models.CartProduct, {
      foreignKey: {
        name: "productId",
      },
    });
  };

  return Product;
};
