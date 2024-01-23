const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model { // Comment 모델을 만듦
  static init(sequelize) {
    return super.init({ // super.init으로 모델 초기화
      comment: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
    }, {
      sequelize, // sequelize 객체를 넣어야 함
      timestamps: false,
      modelName: 'Comment',
      tableName: 'comments',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {}
};