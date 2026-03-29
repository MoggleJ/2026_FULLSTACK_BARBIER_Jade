import * as favService from '../services/favorites-service.js';
import { handle } from '../utils/handle.js';

export const getAll  = handle(async (req, res) => {
  const favorites = await favService.getFavorites(req.user.id);
  res.json(favorites);
});

export const add = handle(async (req, res) => {
  const appId = parseInt(req.params.appId);
  if (isNaN(appId)) return res.status(400).json({ error: 'appId invalide' });
  const result = await favService.addFavorite(req.user.id, appId);
  res.status(201).json(result ?? { message: 'Déjà en favoris' });
});

export const remove = handle(async (req, res) => {
  const appId = parseInt(req.params.appId);
  if (isNaN(appId)) return res.status(400).json({ error: 'appId invalide' });
  await favService.removeFavorite(req.user.id, appId);
  res.status(204).end();
});
