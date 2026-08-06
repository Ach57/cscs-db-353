import { Router } from 'express';
import { pool } from '../db/database';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Demo-day requirement: PODs need to verify the connection to AITS directly
// (5 pts, graded standalone). Hit GET /api/v1/health on the lab PC to prove
// it live rather than eyeballing the terminal logs.
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const start = Date.now();
    await pool.query('SELECT 1');
    res.json({
      success: true,
      data: {
        status: 'ok',
        database: 'connected',
        latency_ms: Date.now() - start,
      },
    });
  }),
);

export default router;
