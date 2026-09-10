const store = new Map();

export function create(id, record) {
  store.set(id, record);
  return record;
}

export function get(id) {
  return store.get(id) || null;
}

export function getAll() {
  return Array.from(store.values());
}

export function update(id, record) {
  if (!store.has(id)) return null;
  store.set(id, record);
  return record;
}

export function remove(id) {
  if (!store.has(id)) return false;
  store.delete(id);
  return true;
}

export function clear() {
  store.clear();
}

export function size() {
  return store.size;
}
