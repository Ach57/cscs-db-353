import { Router } from 'express';
import healthRoutes from './health.routes';
import locationRoutes from './location.routes';
import personnelRoutes from './personnel.routes';
import familyMemberRoutes from './family-member.routes';
import clubMemberRoutes from './club-member.routes';
import hobbyRoutes from './hobby.routes';
import paymentRoutes from './payment.routes';
import sessionRoutes from './session.routes';
import formationRoutes from './formation.routes';
import fifaRoutes from './fifa.routes';
import emailRoutes from './email.routes';
import reportRoutes from './report.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/locations', locationRoutes);
router.use('/personnel', personnelRoutes);
router.use('/family-members', familyMemberRoutes);
router.use('/club-members', clubMemberRoutes);
router.use('/hobbies', hobbyRoutes);
router.use('/payments', paymentRoutes);
router.use('/sessions', sessionRoutes);
router.use('/formations', formationRoutes);
router.use('/fifa-games', fifaRoutes);
router.use('/email-logs', emailRoutes);
router.use('/reports', reportRoutes);

export default router;
