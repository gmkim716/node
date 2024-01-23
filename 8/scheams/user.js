const mongoose = require("mongoose");

const { Schema } = mongoose; // 스키마 생성
const userSchema = new Schema({
  name: {
    type: String,
    required: true, // 필수
    unique: true, // 고유한 값
  },
  age: {
    type: Number,
    required: true,
  },
  married: {
    type: Boolean,
    required: true,
  },
  comment: String, // 필수는 아님
  createdAt: {
    type: Date,
    default: Date.now, // 기본값
  },
});

module.exports = mongoose.model("User", userSchema); // 스키마를 모델로 감싸줌
