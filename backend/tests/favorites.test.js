import { jest } from '@jest/globals';

// ── Mocks ───────────────────────────────────────────────────────────────────

jest.unstable_mockModule('../src/repositories/favorites-repository.js', () => ({
  findByUser: jest.fn(),
  add:        jest.fn(),
  remove:     jest.fn(),
}));

jest.unstable_mockModule('../src/db.js', () => ({
  default: { query: jest.fn() },
}));

// ── Imports après mocks ─────────────────────────────────────────────────────

const favRepo = await import('../src/repositories/favorites-repository.js');
const db      = (await import('../src/db.js')).default;
const { getFavorites, addFavorite, removeFavorite } =
  await import('../src/services/favorites-service.js');

// ── Tests ───────────────────────────────────────────────────────────────────

describe('favorites-service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getFavorites', () => {
    it('returns the user favorites list', async () => {
      const mockFavs = [{ app_id: 1, name: 'Netflix' }];
      favRepo.findByUser.mockResolvedValueOnce(mockFavs);

      const result = await getFavorites('user-uuid');
      expect(result).toEqual(mockFavs);
      expect(favRepo.findByUser).toHaveBeenCalledWith('user-uuid');
    });
  });

  describe('addFavorite', () => {
    it('throws 404 if app does not exist', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 0 });
      await expect(addFavorite('user-uuid', 999)).rejects.toMatchObject({ status: 404 });
    });

    it('adds favorite when app exists', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 });
      favRepo.add.mockResolvedValueOnce({ user_id: 'user-uuid', app_id: 1 });

      const result = await addFavorite('user-uuid', 1);
      expect(result).toEqual({ user_id: 'user-uuid', app_id: 1 });
      expect(favRepo.add).toHaveBeenCalledWith('user-uuid', 1);
    });

    it('returns null (no error) on duplicate favorite (ON CONFLICT DO NOTHING)', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 });
      favRepo.add.mockResolvedValueOnce(null);

      const result = await addFavorite('user-uuid', 1);
      expect(result).toBeNull();
    });
  });

  describe('removeFavorite', () => {
    it('throws 404 if favorite does not exist', async () => {
      favRepo.remove.mockResolvedValueOnce(false);
      await expect(removeFavorite('user-uuid', 1)).rejects.toMatchObject({ status: 404 });
    });

    it('removes favorite successfully', async () => {
      favRepo.remove.mockResolvedValueOnce(true);
      await expect(removeFavorite('user-uuid', 1)).resolves.toBeUndefined();
    });
  });
});
