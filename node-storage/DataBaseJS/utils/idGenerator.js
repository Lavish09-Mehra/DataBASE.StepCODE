let currentId = 0;

export function getNextId() {
  currentId += 1;
  return currentId;
}

export function getCurrentId() {
  return currentId;
}

export function setCurrentId(id) {
  currentId = id;
}

export function resetId() {
  currentId = 0;
}
