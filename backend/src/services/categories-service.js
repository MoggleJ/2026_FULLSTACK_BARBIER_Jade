import * as categoryRepo from '../repositories/category-repository.js';

function fail(status, message) {
  return Object.assign(new Error(message), { status });
}

export async function getAll() {
  return categoryRepo.findAll();
}

export async function create(name, mode) {
  if (!name || !mode) throw fail(400, 'name et mode sont requis');
  return categoryRepo.create(name, mode);
}
