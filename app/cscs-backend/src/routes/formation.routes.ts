import { Router } from 'express';
import * as controller from '../controllers/formation.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  formationIdParamSchema,
  formationMemberParamsSchema,
  createFormationSchema,
  updateFormationSchema,
  addFormationMemberSchema,
  updateFormationMemberSchema,
} from '../types/session.types';

const router = Router();

router.get('/', asyncHandler(controller.getAll));
router.get('/assignment-overview', asyncHandler(controller.getMemberAssignments));
router.get('/:id', validate(formationIdParamSchema, 'params'), asyncHandler(controller.getOne));
router.post('/', validate(createFormationSchema), asyncHandler(controller.create));
router.put(
  '/:id',
  validate(formationIdParamSchema, 'params'),
  validate(updateFormationSchema),
  asyncHandler(controller.update),
);
router.delete(
  '/:id',
  validate(formationIdParamSchema, 'params'),
  asyncHandler(controller.remove),
);

// ── Formation member assignments ──────────────────────────────────────────────
router.post(
  '/:id/assignments',
  validate(formationIdParamSchema, 'params'),
  validate(addFormationMemberSchema),
  asyncHandler(controller.addMember),
);
router.put(
  '/:id/assignments/:membershipNumber',
  validate(formationMemberParamsSchema, 'params'),
  validate(updateFormationMemberSchema),
  asyncHandler(controller.updateMember),
);
router.delete(
  '/:id/assignments/:membershipNumber',
  validate(formationMemberParamsSchema, 'params'),
  asyncHandler(controller.removeMember),
);

export default router;
