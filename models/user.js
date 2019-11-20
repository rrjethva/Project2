var bcrypt = require("bcryptjs");
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: 15
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: 15
      }
    }
  });

  User.associate = function (models) {
    User.belongsToMany(models.Score, {
      through: "LeaderBoard",
      as: "Score",
      foreignKey: "usernameId",
      otherKey: "scoreId"
    });

    User.prototype.validPassword = function (password) {
      return bcrypt.compareSync(password, this.password);
    };
    User.addHook("beforeCreate", function (user) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });
    return User;
  };
};

