import { jest } from '@jest/globals';

// ── Mocks ───────────────────────────────────────────────────────────────────

jest.unstable_mockModule('../src/repositories/settings-repository.js', () => ({
  findByUserId:    jest.fn(),
  updateByUserId:  jest.fn(),
}));

// ── Imports après mocks ─────────────────────────────────────────────────────

const settingsRepo = await import('../src/repositories/settings-repository.js');
const { get, update } = await import('../src/services/settings-service.js');

// ── Tests ───────────────────────────────────────────────────────────────────

describe('settings-service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('get', () => {
    it('returns settings for a user', async () => {
      const mockSettings = { theme: 'dark', mode: 'TV', layout: 'grid' };
      settingsRepo.findByUserId.mockResolvedValueOnce(mockSettings);

      const result = await get('user-uuid');
      expect(result).toEqual(mockSettings);
      expect(settingsRepo.findByUserId).toHaveBeenCalledWith('user-uuid');
    });
  });

  describe('update', () => {
    it('throws 404 if settings not found', async () => {
      settingsRepo.updateByUserId.mockResolvedValueOnce(null);
      await expect(update('user-uuid', { theme: 'dark-blue' })).rejects.toMatchObject({ status: 404 });
    });

    it('persists theme correctly', async () => {
      const updated = { theme: 'dark-blue', mode: 'TV', layout: 'grid' };
      settingsRepo.updateByUserId.mockResolvedValueOnce(updated);

      const result = await update('user-uuid', { theme: 'dark-blue' });
      expect(result.theme).toBe('dark-blue');
      expect(settingsRepo.updateByUserId).toHaveBeenCalledWith('user-uuid', { theme: 'dark-blue' });
    });

    it('persists all 10 theme values without error', async () => {
      const themes = ['dark', 'dark-blue', 'dark-purple', 'amoled', 'dark-green',
                      'light', 'light-warm', 'light-blue', 'light-purple', 'light-green'];
      for (const theme of themes) {
        settingsRepo.updateByUserId.mockResolvedValueOnce({ theme });
        const result = await update('user-uuid', { theme });
        expect(result.theme).toBe(theme);
      }
    });
  });
});
