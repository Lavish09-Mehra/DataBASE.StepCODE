import * as memoryStore from './memoryStore.js';
import * as idGenerator from '../utils/idGenerator.js';
import { registerFieldsFromObject, getAllFields } from '../utils/fieldRegistry.js';
import { encodeRecord, decodeRecord } from '../utils/encoder.js';

export function createRecord(val) {
  const id = idGenerator.getNextId();
  const record = { pass_id: id, val: { ...val } };
  memoryStore.create(id, record);
  registerFieldsFromObject(val);
  return record;
}

export function getRecord(id) {
  return memoryStore.get(id);
}

export function getAllRecords() {
  return memoryStore.getAll();
}

export function updateRecord(id, val) {
  const existing = memoryStore.get(id);
  if (!existing) return null;
  const updated = { pass_id: id, val: { ...val } };
  memoryStore.update(id, updated);
  registerFieldsFromObject(val);
  return updated;
}

export function patchRecord(id, val) {
  const existing = memoryStore.get(id);
  if (!existing) return null;
  const patched = {
    pass_id: id,
    val: deepMerge(existing.val, val)
  };
  memoryStore.update(id, patched);
  registerFieldsFromObject(val);
  return patched;
}

export function deleteRecord(id) {
  return memoryStore.remove(id);
}

export function searchRecords(query) {
  const all = memoryStore.getAll();
  const results = [];
  for (const record of all) {
    if (searchInObject(record.val, query)) {
      results.push(record);
    }
  }
  return results;
}

export function getEncodedRecord(id) {
  const record = memoryStore.get(id);
  if (!record) return null;
  return encodeRecord(record);
}

export function getEncodedAll() {
  const all = memoryStore.getAll();
  return all.map(record => encodeRecord(record));
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key]) &&
      typeof result[key] === 'object' &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function searchInObject(obj, query) {
  if (query === undefined || query === null) return false;
  const q = String(query).toLowerCase();

  if (typeof obj === 'string') return obj.toLowerCase().includes(q);
  if (typeof obj === 'number') return String(obj).toLowerCase().includes(q);
  if (typeof obj === 'boolean') return String(obj).toLowerCase().includes(q);
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (searchInObject(item, query)) return true;
    }
    return false;
  }
  if (typeof obj === 'object' && obj !== null) {
    for (const key of Object.keys(obj)) {
      if (searchInObject(obj[key], query)) return true;
    }
    return false;
  }
  return false;
}
