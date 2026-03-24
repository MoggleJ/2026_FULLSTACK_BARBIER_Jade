import * as appRepo from '../repositories/app-repository.js';

function fail(status, message) {
  return Object.assign(new Error(message), { status });
}

export async function getAll(mode) {
  return appRepo.findAll(mode ?? null);
}

export async function getById(id) {
  const app = await appRepo.findById(id);
  if (!app) throw fail(404, 'App introuvable');
  return app;
}

export async function create(data) {
  if (!data.name || !data.url || !data.mode)
    throw fail(400, 'name, url et mode sont requis');
  return appRepo.create(data);
}

export async function update(id, data) {
  const app = await appRepo.update(id, data);
  if (!app) throw fail(404, 'App introuvable');
  return app;
}

export async function destroy(id) {
  const deleted = await appRepo.remove(id);
  if (!deleted) throw fail(404, 'App introuvable');
}
