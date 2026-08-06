import { Router } from 'express';
import * as controller from '../controllers/fifa.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  gameIdParamSchema,
  gameParticipantParamsSchema,
  createFIFAGameSchema,
  updateFIFAGameSchema,
  addParticipantSchema,
} from '../types/fifa.types';

const router = Router();

router.get('/', asyncHandler(controller.getAll));
router.get('/:id', validate(gameIdParamSchema, 'params'), asyncHandler(controller.getOne));
router.post('/', validate(createFIFAGameSchema), asyncHandler(controller.create));
router.put(
  '/:id',
  validate(gameIdParamSchema, 'params'),
  validate(updateFIFAGameSchema),
  asyncHandler(controller.update),
);
router.delete('/:id', validate(gameIdParamSchema, 'params'), asyncHandler(controller.remove));

// ── Participants sub-resource ─────────────────────────────────────────────────
router.post(
  '/:id/participants',
  validate(gameIdParamSchema, 'params'),
  validate(addParticipantSchema),
  asyncHandler(controller.addParticipant),
);
router.delete(
  '/:id/participants/:membershipNumber',
  validate(gameParticipantParamsSchema, 'params'),
  asyncHandler(controller.removeParticipant),
);

export default router;
