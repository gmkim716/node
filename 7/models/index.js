const Sequelize = require("sequelize");
const User = require("./user");
const Comment = require("./comment");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env]; // config.json에서 development 객체 가져옴
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
db.sequelize = sequelize; // db.sequelize로 접근 가능

// db 객체에 User, Comment 모델을 담음
db.User = User;
db.Comment = Comment;

// User, Comment 모델에 db 객체를 넣어줌
User.init(sequelize);
Comment.init(sequelize);

// User, Comment 모델에 associate 메서드를 호출
User.associate(db);
Comment.associate(db);

module.exports = db; // db 객체를 모듈로 만듦
