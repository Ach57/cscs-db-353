import { Router } from 'express';
import * as controller from '../controllers/personnel.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  personnelIdParamSchema,
  personnelAssignmentParamsSchema,
  personnelAssignmentIdParamSchema,
  createPersonnelSchema,
  updatePersonnelSchema,
  createPersonnelAssignmentSchema,
  updatePersonnelAssignmentSchema,
  createPersonnelAssignmentFlatSchema,
} from '../types/personnel.types';

const router = Router();

// ── Flat assignment resource (must be before /:id to avoid param collision) ───
router.get('/personnel-assignment', asyncHandler(controller.getAllAssignments));
router.post(
  '/personnel-assignment',
  validate(createPersonnelAssignmentFlatSchema),
  asyncHandler(controller.createAssignmentFlat),
);
router.put(
  '/personnel-assignment/:assignmentId',
  validate(personnelAssignmentIdParamSchema, 'params'),
  validate(updatePersonnelAssignmentSchema),
  asyncHandler(controller.updateAssignmentFlat),
);
router.delete(
  '/personnel-assignment/:assignmentId',
  validate(personnelAssignmentIdParamSchema, 'params'),
  asyncHandler(controller.removeAssignmentFlat),
);

router.get('/', asyncHandler(controller.getAll));
router.get(
  '/:id',
  validate(personnelIdParamSchema, 'params'),
  asyncHandler(controller.getOne),
);
router.post(
  '/',
  validate(createPersonnelSchema),
  asyncHandler(controller.create),
);
router.put(
  '/:id',
  validate(personnelIdParamSchema, 'params'),
  validate(updatePersonnelSchema),
  asyncHandler(controller.update),
);
router.delete(
  '/:id',
  validate(personnelIdParamSchema, 'params'),
  asyncHandler(controller.remove),
);

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
