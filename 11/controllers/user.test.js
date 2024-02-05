jest.mock('../models/user');  // user 모델 모의 함수화
const User = require('../models/user');  // user 모델을 가져옴
const { addFollowing } = require('./user');

describe('addFollowing', () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  }
  const next = jest.fn();

  test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
    User.findOne.mockReturnValue(Promise.resolve({  // findOne 모의 함수 구현
      addFollowing(id) { 
        return Promise.resolve(true);
      }
    }));
    await addFollowing(req, res, next);
    expect(res.send).toBeCalledWith('success');
  });
  
  test('사용자를 못 찾으면 no user를 응답해야 함', async () => {
    User.findOne.mockReturnValue(Promise.resolve(null));
    await addFollowing(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith('no user');
  });

  test('DB에서 에러가 발생하면 next(error)를 호출해야 함', async () => {  
    const error = '테스트용 에러';
    User.findOne.mockReturnValue(Promise.reject(error));
    await addFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
})