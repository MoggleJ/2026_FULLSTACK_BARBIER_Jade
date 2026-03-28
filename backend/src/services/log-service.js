import * as logRepo from '../repositories/log-repository.js';

export async function log(userId, action, metadata = null) {
  try {
    await logRepo.insert(userId, action, metadata);
  } catch {
    // Ne jamais bloquer l'action principale si le log échoue
  }
}

export async function getLogs({ limit, offset } = {}) {
  return logRepo.findAll({ limit, offset });
}
