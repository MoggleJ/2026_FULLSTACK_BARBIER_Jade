import * as logService from '../services/log-service.js';
import { handle } from '../utils/handle.js';

export const getAll = handle(async (req, res) => {
  const limit  = Math.min(parseInt(req.query.limit)  || 100, 500);
  const offset = parseInt(req.query.offset) || 0;
  const logs = await logService.getLogs(limit, offset);
  res.json(logs);
});
