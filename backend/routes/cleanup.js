// backend/routes/cleanup.js
import express from 'express';
import { cleanupOrphanedData } from '../controllers/cleanupController.js';
import { verifyAdmin } from '../middleware/auth/index.js';

const router = express.Router();

// DELETE /api/cleanup
router.delete('/', verifyAdmin, cleanupOrphanedData);

export default router;
