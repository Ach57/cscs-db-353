import { Router } from 'express';
import * as controller from '../controllers/report.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { reportIdParamSchema, reportQuerySchema } from '../types/report.types';
const router = Router();
router.get('/', asyncHandler(controller.catalog));
router.get('/:id', validate(reportIdParamSchema, 'params'), validate(reportQuerySchema, 'query'), asyncHandler(controller.run));
export default router;
