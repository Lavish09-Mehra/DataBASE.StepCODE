const fieldMap = new Map();
let nextFieldId = 1;

export function registerField(fieldName) {
  if (!fieldMap.has(fieldName)) {
    fieldMap.set(fieldName, nextFieldId);
    nextFieldId += 1;
  }
  return fieldMap.get(fieldName);
}

export function getFieldId(fieldName) {
  return fieldMap.get(fieldName) || null;
}

export function getFieldName(fieldId) {
  for (const [name, id] of fieldMap.entries()) {
    if (id === fieldId) return name;
  }
  return null;
}

export function getAllFields() {
  const result = {};
  for (const [name, id] of fieldMap.entries()) {
    result[name] = id;
  }
  return result;
}

export function registerFieldsFromObject(obj) {
  for (const key of Object.keys(obj)) {
    registerField(key);
  }
}
