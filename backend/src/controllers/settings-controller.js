import { handle } from '../utils/handle.js';
import * as settingsService from '../services/settings-service.js';

export const getSettings = handle(async (req, res) => {
  const settings = await settingsService.get(req.user.id);
  res.json({ settings });
});

export const updateSettings = handle(async (req, res) => {
  const settings = await settingsService.update(req.user.id, req.body);
  res.json({ settings });
});
