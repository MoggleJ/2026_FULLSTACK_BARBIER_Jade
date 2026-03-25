import { jest } from '@jest/globals';

// ── Mocks ───────────────────────────────────────────────────────────────────

jest.unstable_mockModule('../../backend/src/repositories/log-repository.js', () => ({
  insert:  jest.fn(),
  findAll: jest.fn(),
}));

// ── Imports après mocks ─────────────────────────────────────────────────────

const logRepo = await import('../../backend/src/repositories/log-repository.js');
const { log, getLogs } = await import('../../backend/src/services/log-service.js');

// ── Tests ───────────────────────────────────────────────────────────────────

describe('log-service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('log', () => {
    it('calls insert with correct arguments', async () => {
      logRepo.insert.mockResolvedValueOnce();
      await log('user-uuid', 'login', { username: 'testuser' });
      expect(logRepo.insert).toHaveBeenCalledWith('user-uuid', 'login', { username: 'testuser' });
    });

    it('does not throw if insert fails (graceful failure)', async () => {
      logRepo.insert.mockRejectedValueOnce(new Error('DB error'));
      await expect(log('user-uuid', 'login')).resolves.toBeUndefined();
    });

    it('works with null userId', async () => {
      logRepo.insert.mockResolvedValueOnce();
      await log(null, 'app_launch', { app_id: 1 });
      expect(logRepo.insert).toHaveBeenCalledWith(null, 'app_launch', { app_id: 1 });
    });
  });

  describe('getLogs', () => {
    it('returns paginated logs', async () => {
      const mockLogs = [
        { id: 1, action: 'login', username: 'alice', created_at: new Date().toISOString() },
        { id: 2, action: 'app_launch', username: 'bob', created_at: new Date().toISOString() },
      ];
      logRepo.findAll.mockResolvedValueOnce(mockLogs);

      const result = await getLogs({ limit: 10, offset: 0 });
      expect(result).toEqual(mockLogs);
      expect(logRepo.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0 });
    });
  });
});
