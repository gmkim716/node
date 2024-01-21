const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) { // 테이블 설정
    return super.init({
      content: {
        type: Sequelize.STRING(140),
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
    }, { // 테이블 옵션
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,
      charset: 'utf8mb4', // 이모티콘 저장
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {  // 다른 모델과의 관계
    db.Post.belongsTo(db.User); // 1:N 관계
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // N:M 관계
  }
}