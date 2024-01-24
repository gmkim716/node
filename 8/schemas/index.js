const mongooes = require("mongoose");

const connect = () => {
  // 개발 환경일 때만 쿼리 내용을 콘솔에 출력
  if (process.env.NODE_ENV !== "production") {
    mongooes.set("debug", true);
  }

  // 몽고디비 연결
  mongooes.connect(
    "mongodb://root:root@localhost:27017/admin",
    {
      dbName: "nodejs",
      useNewUrlParser: true,
      useCreateIndex: true,
    },
    (error) => {
      if (error) {
        console.log("몽고디비 연결 에러", error);
      } else {
        console.log("몽고디비 연결 성공");
      }
    }
  );
};

// 몽고디비 이벤트 리스너
mongooes.connection.on("error", (error) => {
  console.error("몽고디비 연결 에러", error);
});
mongooes.connection.on("disconnected", () => {
  console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
  connect();
});

module.exports = connect;
