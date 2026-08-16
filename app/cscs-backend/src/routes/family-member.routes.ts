import { Router } from 'express';
import * as controller from '../controllers/family-member.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  familyMemberIdParamSchema,
  familyMemberAssignmentParamsSchema,
  familyMemberAssignmentIdParamSchema,
  createFamilyMemberSchema,
  updateFamilyMemberSchema,
  createFamilyMemberAssignmentSchema,
  updateFamilyMemberAssignmentSchema,
  createFamilyMemberAssignmentFlatSchema,
} from '../types/family-member.types';

const router = Router();

// ── Flat assignment resource (must be before /:id to avoid param collision) ───
router.get('/family-members-assignment', asyncHandler(controller.getAllAssignmentsFlat));
router.post(
  '/family-members-assignment',
  validate(createFamilyMemberAssignmentFlatSchema),
  asyncHandler(controller.createAssignmentFlat),
);
router.put(
  '/family-members-assignment/:assignmentId',
  validate(familyMemberAssignmentIdParamSchema, 'params'),
  validate(updateFamilyMemberAssignmentSchema),
  asyncHandler(controller.updateAssignmentFlat),
);
router.delete(
  '/family-members-assignment/:assignmentId',
  validate(familyMemberAssignmentIdParamSchema, 'params'),
  asyncHandler(controller.removeAssignmentFlat),
);

router.get('/', asyncHandler(controller.getAll));
router.get(
  '/:id',
  validate(familyMemberIdParamSchema, 'params'),
  asyncHandler(controller.getOne),
);
router.post(
  '/',
  validate(createFamilyMemberSchema),
  asyncHandler(controller.create),
);
router.put(
  '/:id',
  validate(familyMemberIdParamSchema, 'params'),
  validate(updateFamilyMemberSchema),
  asyncHandler(controller.update),
);
router.delete(
  '/:id',
  validate(familyMemberIdParamSchema, 'params'),
  asyncHandler(controller.remove),
);

router.get(
  '/:id/assignments',
  validate(familyMemberIdParamSchema, 'params'),
  asyncHandler(controller.getAssignments),
);
router.post(
  '/:id/assignments',
  validate(familyMemberIdParamSchema, 'params'),
  validate(createFamilyMemberAssignmentSchema),
  asyncHandler(controller.createAssignment),
);
router.put(
  '/:id/assignments/:assignmentId',
  validate(familyMemberAssignmentParamsSchema, 'params'),
  validate(updateFamilyMemberAssignmentSchema),
  asyncHandler(controller.updateAssignment),
);
router.delete(
  '/:id/assignments/:assignmentId',
  validate(familyMemberAssignmentParamsSchema, 'params'),
  asyncHandler(controller.removeAssignment),
);

export default router;
