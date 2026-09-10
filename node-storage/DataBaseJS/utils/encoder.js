import { getFieldId } from './fieldRegistry.js';

export function encodeRecord(record) {
  const encoded = {};
  for (const [key, value] of Object.entries(record.val)) {
    const fieldId = getFieldId(key);
    if (fieldId !== null) {
      const compositeKey = `${fieldId}.${record.pass_id}`;
      encoded[compositeKey] = value;
    }
  }
  return encoded;
}

export function decodeRecord(encoded, fieldNames) {
  const val = {};
  for (const [compositeKey, value] of Object.entries(encoded)) {
    const dotIndex = compositeKey.indexOf('.');
    const fieldId = parseInt(compositeKey.substring(0, dotIndex), 10);
    const fieldName = fieldNames[fieldId];
    if (fieldName) {
      val[fieldName] = value;
    }
  }
  return val;
}
