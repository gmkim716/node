const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

describe('isLoggedIn', () => {
  const res = {
    status: jest.fn(() => res),  // status 함수를 모의 함수로 만듦
    send: jest.fn(),  // send 함수를 모의 함수로 만듦
  };
  const next = jest.fn(); // next 함수를 모의 함수로 만듦

  test('로그인되어 있으면 isLoggedin이 next를 호출해야 함', () => {
    const req = {
      isAuthenticated: jest.fn(() => true),  // isAuthenticated 함수를 모의 함수로 만듦
    };
    isLoggedIn(req, res, next);  // isLoggedIn 함수 호출
    expect(next).toBeCalledTimes(1);  // next 함수가 한 번 호출됐어야 함
  });

  test('로그인되어 있지 않으면 isLoggedin이 에러를 응답해야 함', () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isLoggedIn(req, res, next);
    expect(res.status).toBeCalledWith(403);  // res.status가 403으로 호출됐어야 함
    expect(res.send).toBeCalledWith('로그인 필요');  // res.send가 '로그인 필요'로 호출됐어야 함
  });
});

describe('isNotLoggedIn', () => {
  const res = {
    redirect: jest.fn(),  // redirect 함수를 모의 함수로 만듦
  };
  const next = jest.fn();  // next 함수를 모의 함수로 만듦

  test('로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 함', () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    isNotLoggedIn(req, res, next);
    const message = encodeURIComponent('로그인한 상태입니다.');
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);  // res.redirect가 `/?error=${message}`로 호출됐어야 함
  });

  test('로그인되어 있지 않으면 isNotLoggedIn이 next를 호출해야 함', () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isNotLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);  // next 함수가 한 번 호출됐어야 함
  });
});

// test('1+1은 2입니다.', () => {
//   expect(1 + 1).toEqual(3); 
// });

