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

export async function update(id, name, mode) {
  if (!name || !mode) throw fail(400, 'name et mode sont requis');
  const category = await categoryRepo.update(id, name, mode);
  if (!category) throw fail(404, 'Catégorie introuvable');
  return category;
}

export async function remove(id) {
  const deleted = await categoryRepo.remove(id);
  if (!deleted) throw fail(404, 'Catégorie introuvable');
}
