const http = require('http');

// name=zerocho;year=1994 처럼 오는 문자열 형식을 { name: 'zerocho', year: '1994' }와 같은 객체로 바꾸는 함수
const parseCookies = (cookie = '') => 
	cookie
		.split(';')
		.map(v => v.split('='))
		.map(([k, ...vs]) => [k, vs.join('=')])
		.reduce((acc, [k, v]) => {
			acc[k.trim()] = decodeURIComponent(v);
			return acc;
		}, {})

	http.createServer((req, res) => {  // createServer가 req객체 에 담긴 쿠키를 분석
		const cookies = parseCookies(req.headers.cookie);
		console.log(req.url, cookies); 
	
		res.writeHead(200, { 'Set-Cookie': 'mycookie=test' });  // res.writeHead: 쿠키를 기록. 헤더에 정보 입력, {상태코드, 헤더 내용} 전달
		res.end('Hello Cookie');
	})
		.listen(8082, () => {
			console.log('8082번 포트에서 서버 대기 중')
		});