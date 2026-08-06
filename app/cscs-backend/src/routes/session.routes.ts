import { Router } from 'express';
import * as controller from '../controllers/session.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  sessionIdParamSchema,
  createSessionSchema,
  updateSessionSchema,
} from '../types/session.types';

const router = Router();

router.get('/', asyncHandler(controller.getAll));
router.get('/:id', validate(sessionIdParamSchema, 'params'), asyncHandler(controller.getOne));
router.post('/', validate(createSessionSchema), asyncHandler(controller.create));
router.put(
  '/:id',
  validate(sessionIdParamSchema, 'params'),
  validate(updateSessionSchema),
  asyncHandler(controller.update),
);
router.delete('/:id', validate(sessionIdParamSchema, 'params'), asyncHandler(controller.remove));

export default router;
