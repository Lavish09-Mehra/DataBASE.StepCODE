export function searchValue(obj, query) {
  if (query === undefined || query === null) return false;
  const q = String(query).toLowerCase();

  if (typeof obj === 'string') {
    return obj.toLowerCase().includes(q);
  }
  if (typeof obj === 'number') {
    return String(obj).toLowerCase().includes(q);
  }
  if (typeof obj === 'boolean') {
    return String(obj).toLowerCase().includes(q);
  }
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (searchValue(item, query)) return true;
    }
    return false;
  }
  if (typeof obj === 'object' && obj !== null) {
    for (const key of Object.keys(obj)) {
      if (searchValue(obj[key], query)) return true;
    }
    return false;
  }
  return false;
}
