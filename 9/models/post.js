const Sequelize = require("sequelize");

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.addHook.init(
      {
        content: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Post",
        tableName: "posts",
        paranoid: false,
        cahrset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User); // belongsTo: User-Post 모델은 1:N 관계
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashTag" }); // belongsToMany: Post-Hashtag 모델은 N:M 관계
  }
};
