import { Router } from 'express';
import { LogController } from '../controllers/log.controller';

const router = Router();
const logController = new LogController();

router.post('/upload', logController.bulkUpload);
router.get('/', logController.getLogs);

export default router;