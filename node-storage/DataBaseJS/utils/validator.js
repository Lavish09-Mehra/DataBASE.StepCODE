const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];

function containsDangerousKeys(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  for (const key of Object.keys(obj)) {
    if (DANGEROUS_KEYS.includes(key)) return true;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (containsDangerousKeys(obj[key])) return true;
    }
  }
  return false;
}

export function validateStoreData(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }
  if (!('val' in body)) {
    return { valid: false, error: 'val is required' };
  }
  if (typeof body.val !== 'object' || body.val === null || Array.isArray(body.val)) {
    return { valid: false, error: 'val must be a JSON object' };
  }
  if (containsDangerousKeys(body.val)) {
    return { valid: false, error: 'Invalid field names detected' };
  }
  return { valid: true };
}

export function validateUpdateData(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }
  if (!('val' in body)) {
    return { valid: false, error: 'val is required' };
  }
  if (typeof body.val !== 'object' || body.val === null || Array.isArray(body.val)) {
    return { valid: false, error: 'val must be a JSON object' };
  }
  if (containsDangerousKeys(body.val)) {
    return { valid: false, error: 'Invalid field names detected' };
  }
  return { valid: true };
}
