import { handle } from '../utils/handle.js';
import * as categoriesService from '../services/categories-service.js';

export const getAll = handle(async (_req, res) => {
  const categories = await categoriesService.getAll();
  res.json({ categories });
});

export const create = handle(async (req, res) => {
  const category = await categoriesService.create(req.body.name, req.body.mode);
  res.status(201).json({ category });
});

export const update = handle(async (req, res) => {
  const category = await categoriesService.update(req.params.id, req.body.name, req.body.mode);
  res.json({ category });
});

export const remove = handle(async (req, res) => {
  await categoriesService.remove(req.params.id);
  res.status(204).end();
});
