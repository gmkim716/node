```shell
  $npm i express
  $npm i -D nodemon   
```
- scripts 부분에 start 속성을 잊지 말고 넣어줄 것
- nodemon app을 하면 app.js을 nodemon으로 실행한다는 뜻
  - 서버 코드에 수정 사항이 생길 때마다 매번 서버를 자동으로 재시작
  - nodemon이 실행되는 콘솔에 rs를 입력해서 수동으로 재시작도 가능
  - nodemon은 개발용으로만 사용하는 것을 권장


``` shell
  $npm i morgan cookie-parser express-session dotenv
```
- dotenv를 제외한 다른 패키지는 미들웨어에 해당
- dotenv는 process.env를 관리하기 위해 설치
  - .env파일을 만들어서 process.env 파일을 생성한다.
  - process.env를 별도의 파일로 관리하면 보안과 설정의 편의성이 생긴다.
  - env 같은 별도의 파일에 비밀키를 적어두고, dotenv 패키지로 비밀 키를 로딩하는 방식으로 관리한다.

## 미들웨어
### morgan
- 기존 로그 외에 추가적인 로그 확인이 가능
- 사용법
  ```javascript
    app.use(morgan('dev'))
  ```

### static
- 정적인 파일들을 제공하는 라우터 역할을 한다.
- 사용법
- ```javascript
    app.use('요청 경로', express.static('실제 경로'));

    app.use('/', express.static(path.join(__dirname, 'public'))); 
  ```

### body-parser
- 본문의 데이터를 해석해서 req.body 객체로 만들어주는 미들웨어
- 폼 데이터나 AJAX 요청의 데이터를 처리
- 단, 멀티파트는 처리하지 못함
- 사용법
  ```javascript
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));  
  ```

### cookie-parser
- 요청에 동봉된 쿠키를 해석해 req.cookies 객체로 만든다
- 사용법
  ```javascript
    app.use(cookieParser(비밀키)); 
  ```

### express-session
- 세션 관리용 미들웨어
- 인수로 세션에 대한 설정을 받는다
- 사용법
  ```javascript
    app.use(session({
      resave: false,  // 요청이 올때 세션에 수정사항이 다시 생기지 않더라도 다시 저장할 것인지 여부
      saveUninitialized: false,  // 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 여부 
      secret: process.env.COOKIE_SECRET,  // 쿠키를 서명하는데 사용되는 secret
      cookie: {  // 세션 쿠기에 대한 설정
        httpOnly: true,  // 클라이언트에서 쿠키를 확인하지 못하도록 함
        secure: false,  // https가 아닌 환경에서도 사용할 수 있도록 함 / 배포시에는 https를 적용하고 secure를 true로 설정하는 것이 좋다 
      },
      name: 'session-cookie',
    }));
  ```