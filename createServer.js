const http = require('http'); 

// // 방법 1
// http.createServer((req, res) => {
// 	res.write('<h1>Hello Node!</h1>')
// 	res.end('<p>Hello Server!</p>');
// }).listen(8080, () => {  // listen: 8080 포트에서 요청을 대기
// 	console.log('8080번 포트에서 서버 대기 중')
// })

// 방법 2
const server = http.createServer((req, res) => {
	res.write('<h1>Hello Node!</h1>')  // write: 클라이언트에 보낼 데이터
	res.end('<p>Hello Server!</p>')  // end: 인자를 보낸 후, 응답을 종료
})

server.listen(8080); 
server.on('listening', () => {
	console.log('8080번 포트에서 서버 대기 중');
});
server.on('error', (error) => {
	console.error(error); 
})