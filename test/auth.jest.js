const express = require('express'); 
const request = require('supertest'); 

jest.mock('../models', () => ({ 
  User: {
    findOne: jest.fn(), 
    create: jest.fn(),  
  },
}));
jest.mock('bcryptjs', () => ({ 
  compare: jest.fn(), 
  hash: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({ 
  sign: jest.fn(), 
}));

const { User } = require('../models'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const authRouter = require('../routes/auth'); 

describe('POST /auth/login', () => { 
  let app;

  beforeAll(() => { 
    process.env.JWT_SECRET = 'test-secret';
  });

  beforeEach(() => { 
    app = express(); 
    app.use(express.json()); 
    app.use('/auth', authRouter); 
    jest.clearAllMocks(); 
  });

  test('returns 400 when username or password missing', async () => { 
    const res = await request(app).post('/auth/login').send({}); 
    expect(res.status).toBe(400); 
    expect(res.body).toEqual({ message: 'Username and password required' }); 
  });

  test('returns 400 when user not found', async () => { 
    User.findOne.mockResolvedValue(null); 

    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'nouser', password: 'pass' }); 

    expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'nouser' } });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid credentials' });
  });

  test('returns 400 when password is invalid', async () => { 
    User.findOne.mockResolvedValue({ id: 1, username: 'alice', password: 'hashed' }); 
    bcrypt.compare.mockResolvedValue(false); 

    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'alice', password: 'wrong' }); 

    expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'alice' } }); 
    expect(bcrypt.compare).toHaveBeenCalledWith('wrong', 'hashed');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid credentials' });
  });

  test('returns token on successful login', async () => { 
    const fakeUser = { id: 2, username: 'bob', password: 'hashedpwd' };
    User.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake-token');

    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'bob', password: 'correct' });

    expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'bob' } });
    expect(bcrypt.compare).toHaveBeenCalledWith('correct', 'hashedpwd');
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: fakeUser.id, username: fakeUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    expect(res.status).toBe(200); 
    expect(res.body).toEqual({ token: 'fake-token' });
  });
});