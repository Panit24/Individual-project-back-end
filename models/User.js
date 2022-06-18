module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      branch: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.TEXT,
      },
      taxId: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
          customValidator(value) {
            if (value === null || value.length < 6) {
              throw new Error(
                "Username can't be empty and must have at least 6 characters"
              );
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          customValidator(value) {
            if (value === null || value.length < 6) {
              throw new Error(
                "Password can't be empty and must have at least 6 characters"
              );
            }
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
        defaultValue: "user",
      },
    },
    {
      underscored: true,
    }
  );
  User.associate = (models) => {
    User.hasMany(models.SaleOrder, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    User.hasMany(models.CartProduct, {
      foreignKey: {
        name: "userId",
      },
    });
  };
  return User;
};
