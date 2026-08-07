import { Router } from 'express';
import * as controller from '../controllers/personnel.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  personnelIdParamSchema,
  personnelAssignmentParamsSchema,
  createPersonnelSchema,
  updatePersonnelSchema,
  createPersonnelAssignmentSchema,
  updatePersonnelAssignmentSchema,
} from '../types/personnel.types';

const router = Router();

router.get('/', asyncHandler(controller.getAll));
router.get('/:id', validate(personnelIdParamSchema, 'params'), asyncHandler(controller.getOne));
router.post('/', validate(createPersonnelSchema), asyncHandler(controller.create));
router.put(
  '/:id',
  validate(personnelIdParamSchema, 'params'),
  validate(updatePersonnelSchema),
  asyncHandler(controller.update),
);
router.delete('/:id', validate(personnelIdParamSchema, 'params'), asyncHandler(controller.remove));

// ── Assignments sub-resource ──────────────────────────────────────────────────
router.get(
  '/:id/assignments',
  validate(personnelIdParamSchema, 'params'),
  asyncHandler(controller.getAssignments),
);
router.post(
  '/:id/assignments',
  validate(personnelIdParamSchema, 'params'),
  validate(createPersonnelAssignmentSchema),
  asyncHandler(controller.createAssignment),
);
router.put(
  '/:id/assignments/:assignmentId',
  validate(personnelAssignmentParamsSchema, 'params'),
  validate(updatePersonnelAssignmentSchema),
  asyncHandler(controller.updateAssignment),
);
router.delete(
  '/:id/assignments/:assignmentId',
  validate(personnelAssignmentParamsSchema, 'params'),
  asyncHandler(controller.removeAssignment),
);

export default router;
