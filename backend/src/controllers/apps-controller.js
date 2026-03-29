import { handle } from '../utils/handle.js';
import * as appsService from '../services/apps-service.js';
import { log } from '../services/log-service.js';

export const getAll = handle(async (req, res) => {
  const apps = await appsService.getAll(req.query.mode);
  res.json({ apps });
});

export const getById = handle(async (req, res) => {
  const app = await appsService.getById(req.params.id);
  await log(req.user?.id ?? null, 'app_launch', { app_id: app.id, app_name: app.name });
  res.json({ app });
});

export const create = handle(async (req, res) => {
  const app = await appsService.create(req.body);
  res.status(201).json({ app });
});

export const update = handle(async (req, res) => {
  const app = await appsService.update(req.params.id, req.body);
  res.json({ app });
});

export const destroy = handle(async (req, res) => {
  await appsService.destroy(req.params.id);
  res.json({ message: 'App supprimée' });
});
