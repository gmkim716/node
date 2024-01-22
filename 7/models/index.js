const sequelize = require("sequelize");

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

module.exports = db; // db 객체를 모듈로 만듦
