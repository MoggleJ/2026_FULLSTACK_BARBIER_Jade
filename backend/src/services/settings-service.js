import * as settingsRepo from '../repositories/settings-repository.js';

function fail(status, message) {
  return Object.assign(new Error(message), { status });
}

export async function get(userId) {
  return settingsRepo.findByUserId(userId);
}

export async function update(userId, patch) {
  const settings = await settingsRepo.updateByUserId(userId, patch);
  if (!settings) throw fail(404, 'Settings introuvables');
  return settings;
}
