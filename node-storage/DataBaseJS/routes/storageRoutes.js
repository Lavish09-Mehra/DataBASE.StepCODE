import { Router } from 'express';
import * as controller from '../controllers/storageController.js';

const router = Router();

router.get('/health', controller.health);
router.post('/storeData', controller.create);
router.get('/storeData/search', controller.search);
router.get('/storeData/encoded', controller.getEncoded);
router.get('/storeData', controller.getAll);
router.get('/storeData/:id', controller.getOne);
router.put('/storeData/:id', controller.update);
router.patch('/storeData/:id', controller.patch);
router.delete('/storeData/:id', controller.remove);

export default router;
