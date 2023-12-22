const http = require('http'); 

http.createServer((req, res) => {
	res.write('<h1>Hello Node!</h1>')  // write: 클라이언트에 보낼 데이터
	res.end('<p>Hello Server!</p>')  // end: 인자를 보낸 후, 응답을 종료
}).listen(8080, () => {
	console.log('8080번 포트에서 서버 대기 중')
})