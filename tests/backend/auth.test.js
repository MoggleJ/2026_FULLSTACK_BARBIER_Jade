import { jest } from '@jest/globals';

// ── Mocks ───────────────────────────────────────────────────────────────────

jest.unstable_mockModule('../../backend/src/repositories/user-repository.js', () => ({
  findByUsername:      jest.fn(),
  findById:            jest.fn(),
  create:              jest.fn(),
  createDefaultSettings: jest.fn(),
}));

jest.unstable_mockModule('../../backend/src/services/log-service.js', () => ({
  log: jest.fn(),
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: {
    hash:    jest.fn(),
    compare: jest.fn(),
  },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign:   jest.fn(() => 'mock_token'),
    verify: jest.fn(),
  },
}));

// ── Imports après mocks ─────────────────────────────────────────────────────

const userRepo  = await import('../../backend/src/repositories/user-repository.js');
const logSvc    = await import('../../backend/src/services/log-service.js');
const bcrypt    = (await import('bcrypt')).default;
const { register, login } = await import('../../backend/src/services/auth-service.js');

// ── Tests ───────────────────────────────────────────────────────────────────

describe('auth-service — register', () => {
  beforeEach(() => jest.clearAllMocks());

  it('throws 400 if username or password is missing', async () => {
    await expect(register('', 'pass123')).rejects.toMatchObject({ status: 400 });
    await expect(register('user', '')).rejects.toMatchObject({ status: 400 });
  });

  it('throws 400 if username is too short', async () => {
    await expect(register('ab', 'pass123')).rejects.toMatchObject({ status: 400 });
  });

  it('throws 400 if password is too short (< 6 chars)', async () => {
    await expect(register('validuser', '123')).rejects.toMatchObject({ status: 400 });
  });

  it('throws 409 if username already exists', async () => {
    userRepo.findByUsername.mockResolvedValueOnce({ id: 'existing-id' });
    await expect(register('taken', 'pass123')).rejects.toMatchObject({ status: 409 });
  });

  it('creates user and returns token on valid input', async () => {
    userRepo.findByUsername.mockResolvedValueOnce(null);
    bcrypt.hash.mockResolvedValueOnce('hashed_pw');
    userRepo.create.mockResolvedValueOnce({ id: 'new-id', username: 'newuser', role: 'user' });
    userRepo.createDefaultSettings.mockResolvedValueOnce();

    const result = await register('newuser', 'pass123');

    expect(result.token).toBe('mock_token');
    expect(result.user.username).toBe('newuser');
    expect(userRepo.create).toHaveBeenCalledWith('newuser', 'hashed_pw');
  });
});

describe('auth-service — login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('throws 400 if fields are missing', async () => {
    await expect(login('', 'pass')).rejects.toMatchObject({ status: 400 });
    await expect(login('user', '')).rejects.toMatchObject({ status: 400 });
  });

  it('throws 401 if user not found', async () => {
    userRepo.findByUsername.mockResolvedValueOnce(null);
    await expect(login('unknown', 'pass123')).rejects.toMatchObject({ status: 401 });
  });

  it('throws 401 if password is wrong', async () => {
    userRepo.findByUsername.mockResolvedValueOnce({ id: 'id1', username: 'user', role: 'user', password_hash: 'hash' });
    bcrypt.compare.mockResolvedValueOnce(false);
    await expect(login('user', 'wrongpass')).rejects.toMatchObject({ status: 401 });
  });

  it('returns token on valid credentials', async () => {
    userRepo.findByUsername.mockResolvedValueOnce({ id: 'id1', username: 'user', role: 'user', password_hash: 'hash' });
    bcrypt.compare.mockResolvedValueOnce(true);
    logSvc.log.mockResolvedValueOnce();

    const result = await login('user', 'pass123');

    expect(result.token).toBe('mock_token');
    expect(result.user.username).toBe('user');
    expect(logSvc.log).toHaveBeenCalledWith('id1', 'login', { username: 'user' });
  });
});
