import * as storageService from '../services/storageService.js';
import { validateStoreData, validateUpdateData, parseId } from '../utils/validator.js';

export function create(req, res) {
  const validation = validateStoreData(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const record = storageService.create(req.body.val);
  res.status(201).json({ data: record });
}

export function getAll(req, res) {
  const records = storageService.getAll();
  res.json({ data: records });
}

export function getOne(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const record = storageService.get(id);
  if (!record) {
    return res.status(404).json({ error: 'Record not found' });
  }
  res.json({ data: record });
}

export function update(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const validation = validateUpdateData(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const record = storageService.update(id, req.body.val);
  if (!record) {
    return res.status(404).json({ error: 'Record not found' });
  }
  res.json({ data: record });
}

export function patch(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const validation = validateUpdateData(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const record = storageService.patch(id, req.body.val);
  if (!record) {
    return res.status(404).json({ error: 'Record not found' });
  }
  res.json({ data: record });
}

export function remove(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const deleted = storageService.remove(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Record not found' });
  }
  res.json({ message: 'Record deleted', pass_id: id });
}

export function search(req, res) {
  const query = req.query.q;
  if (query === undefined || query === '') {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  const results = storageService.search(query);
  res.json({ data: results });
}

export function health(req, res) {
  res.json({ status: 'ok', service: 'node-storage' });
}

export function getEncoded(req, res) {
  const records = storageService.getEncodedAll();
  res.json({ data: records });
}
