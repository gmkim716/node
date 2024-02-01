const Sequalize = require("sequelize");

module.exports = class Domain extends Sequalize.Model {
  // 테이블 설정
  static init(sequelize) {
    return super.init({
      host: {  // host: 도메인
        type: Sequalize.STRING(80),  // 80글자 이하
        allowNull: false,  // 필수
      },
      type: {  // type: 도메인 종류
        type: Sequalize.ENUM("free", "premium"),  // free/premium 중 하나
        allowNull: false,  // 필수
      },
      clientSecret: {  // clientSecret: 클라이언트 비밀키 
        type: Sequalize.UUID,  // UUID 데이터 타입
        allowNull: false,  // 필수
      },
    }, {
      sequelize,  // 시퀄라이즈 연결 객체
      timestamps: true,  // 생성일, 수정일 컬럼 추가
      paranoid: true,  // 삭제일 컬럼 추가
      modelName: "Domain",  // 모델 이름 설정
      tableName: "domains",  // 실제 데이터베이스의 테이블 이름 설정
    });
  }

  // 다른 모델과의 관계
  static associate(db) {
    db.Domain.belongsTo(db.User);  // User 모델에 속해 있음
  }
};
