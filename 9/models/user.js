const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        eamil: {
          type: Sequelize.STRING(40),
          allowNull: true,
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        // local이면 로컬 로그인을, kakao면 카카오 로그인을 진행한 것
        provider: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: "local",
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8)_general_ci",
      }
    );
  }

  static associate(db) {
    // User-Post 모델은 1:N 관계에 있으므로 hasMany로 연결
    db.User.hasMany(db.Post);

    // N:M 관계를 가질 때
    // through: 매개 테이블 명 지정
    // as: FK와 반대되는 모델(*)을 가리킨다 / FK가 followerId이면 as는 Followings, FK가 followingId이면 as는 Follwers
    db.User.belongsToMany(db.User, {
      foreignKey: "followingId",
      as: "Follwers",
      through: "Follow",
    });
    db.User.belongsToMany(db.User, {
      foreignKey: "followerId",
      as: "Followings",
      through: "Follow",
    });
  }
};
