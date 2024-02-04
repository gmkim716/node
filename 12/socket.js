const SocketIO = require("socket.io");
const axios = require("axios");

module.exports = (server, app, sessionMiddelware) => {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io); // app 객체에 io 객체를 연결
  // 네임스페이스
  const room = io.of("/room");
  const chat = io.of("/chat");

  io.use((socket, next) => {
    sessionMiddelware(socket.request, socket.request.res, next);
  });

  room.on("connection", (socket) => {
    console.log("room 네임스페이스에 접속");
    socket.on("disconnect", () => {
      console.log("클라이언트 접속 해제", ip, socket.id);
    });
  });

  chat.on("connection", (socket) => {
    console.log("chat 네임스페이스에 접속");
    const req = socket.request;
    const {
      headers: { referer },
    } = req;
    const roomId = referer
      .split("/")
      [referer.split("/").length - 1].replace(/\?.+/, "");
    socket.join(roomId);
    socket.to(roomId).emit("join", {
      user: "system",
      chat: `${req.session.color}님이 입장하셨습니다.`,
    });

    socket.on("disconnect", () => {
      console.log("chat 네임스페이스 접속 해제", roomId);
      socket.leave(roomId);
      const currentRoom = socket.adapter.rooms[roomId];
      const userCount = currentRoom ? currentRoom.length : 0;

      // 유저가 0명이면 방 삭제
      if (userCount === 0) {
        axios
          .delete(`http://localhost:8005/room/${roomId}`)
          .then(() => {
            console.log("방 제거 요청 성공");
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        socket.to(roomId).emit("exit", {
          user: "system",
          chat: `${req.session.color}님이 퇴장하셨습니다.`,
        });
      }
    });
  });
};
