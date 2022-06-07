module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
    {
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
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
  return Admin;
};
