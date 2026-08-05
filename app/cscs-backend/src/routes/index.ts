import { Router } from 'express';
import locationRoutes from './location.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/locations', locationRoutes);

// Next entities plug in the exact same way, e.g.:
// router.use('/personnel', personnelRoutes);
// router.use('/club-members', clubMemberRoutes);
// router.use('/sessions', sessionRoutes);

export default router;
