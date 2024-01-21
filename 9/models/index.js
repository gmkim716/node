const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]; // config.json에서 development 객체 가져옴
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');

const db = {};
const sequelize = new Sequelize( // 시퀄라이즈 생성자로 데이터베이스 연결
  config.database, config.username, config.password, config,
); 

// db 객체에 모델들을 담아두고, db 객체를 require하여 다른 모듈에서 사용
db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

// 각 모델의 static.init 메서드를 호출하여 테이블 생성
User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

// 각 모델의 associate 메서드를 호출하여 다른 모델과의 관계 설정
User.associate(db);
Post.associate(db);
Hashtag.associate(db);

module.exports = db; // db 객체를 모듈로 내보냄