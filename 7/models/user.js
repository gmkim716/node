const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model { // User 모델을 만듦
  static init(sequelize) { // 테이블에 대한 설정
    return super.init({ // super.init으로 모델 초기화
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      age: {
        type: Sequelize.INTEGER.UNSIGNED, // UNSIGNED: 양수
        allowNull: false,
      },
      married: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }, {
      sequelize, // sequelize 객체를 넣어야 함
      timestamps: false, // timestamps를 true로 하면 createdAt, updatedAt 컬럼이 자동으로 추가됨, false면 수동으로 추가해야 함
      underscored: false, // 기본적으로 테이블명과 컬럼명은 snake case로 생성됨, true면 camel case로 생성됨
      modelName: 'User',
      tableName: 'users',
      paranoid: false, // true면 deletedAt 컬럼이 생김, 로우를 삭제하는 대신 deletedAt에 지운 날짜를 입력, 로우 복구가 가능함, timestamps가 true여야 사용 가능
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글 저장
    });
  }
  static associate(db) {} // 다른 모델과의 관계
};