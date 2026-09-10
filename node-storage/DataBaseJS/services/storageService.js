import * as adapter from '../storage/storageAdapter.js';

export function create(val) {
  return adapter.createRecord(val);
}

export function get(id) {
  return adapter.getRecord(id);
}

export function getAll() {
  return adapter.getAllRecords();
}

export function update(id, val) {
  return adapter.updateRecord(id, val);
}

export function patch(id, val) {
  return adapter.patchRecord(id, val);
}

export function remove(id) {
  return adapter.deleteRecord(id);
}

export function search(query) {
  return adapter.searchRecords(query);
}

export function getEncodedAll() {
  return adapter.getEncodedAll();
}
