import { Router } from 'express';
import * as controller from '../controllers/club-member.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  membershipNumberParamSchema,
  memberHobbyParamsSchema,
  memberRelationParamsSchema,
  relationIdParamSchema,
  hobbyIdParamSchema,
  createClubMemberSchema,
  updateClubMemberSchema,
  addHobbySchema,
  createHobbySchema,
  createFamilyRelationSchema,
  updateFamilyRelationSchema,
  createFlatFamilyRelationSchema,
} from '../types/club-member.types';

const router = Router();

// ── Flat family-relations CRUD (must be defined before /:id routes) ─────────────
router.get('/family-relations', asyncHandler(controller.getAllFamilyRelationsFlat));
router.post(
  '/family-relations',
  validate(createFlatFamilyRelationSchema),
  asyncHandler(controller.createFlatFamilyRelation),
);
router.put(
  '/family-relations/:relationId',
  validate(relationIdParamSchema, 'params'),
  validate(updateFamilyRelationSchema),
  asyncHandler(controller.updateFamilyRelation),
);
router.delete(
  '/family-relations/:relationId',
  validate(relationIdParamSchema, 'params'),
  asyncHandler(controller.removeFamilyRelation),
);

// ── Club Members CRUD ─────────────────────────────────────────────────────────
router.get('/', asyncHandler(controller.getAll));
router.get('/:id', validate(membershipNumberParamSchema, 'params'), asyncHandler(controller.getOne));
router.post('/', validate(createClubMemberSchema), asyncHandler(controller.create));
router.put(
  '/:id',
  validate(membershipNumberParamSchema, 'params'),
  validate(updateClubMemberSchema),
  asyncHandler(controller.update),
);
router.delete(
  '/:id',
  validate(membershipNumberParamSchema, 'params'),
  asyncHandler(controller.remove),
);

// ── Member hobbies ────────────────────────────────────────────────────────────
router.get(
  '/:id/hobbies',
  validate(membershipNumberParamSchema, 'params'),
  asyncHandler(controller.getMemberHobbies),
);
router.post(
  '/:id/hobbies',
  validate(membershipNumberParamSchema, 'params'),
  validate(addHobbySchema),
  asyncHandler(controller.addMemberHobby),
);
router.delete(
  '/:id/hobbies/:hobbyId',
  validate(memberHobbyParamsSchema, 'params'),
  asyncHandler(controller.removeMemberHobby),
);

// ── Member family relations ───────────────────────────────────────────────────
router.get(
  '/:id/family-relations',
  validate(membershipNumberParamSchema, 'params'),
  asyncHandler(controller.getFamilyRelations),
);
router.post(
  '/:id/family-relations',
  validate(membershipNumberParamSchema, 'params'),
  validate(createFamilyRelationSchema),
  asyncHandler(controller.createFamilyRelation),
);
router.put(
  '/:id/family-relations/:relationId',
  validate(memberRelationParamsSchema, 'params'),
  validate(updateFamilyRelationSchema),
  asyncHandler(controller.updateFamilyRelation),
);
router.delete(
  '/:id/family-relations/:relationId',
  validate(memberRelationParamsSchema, 'params'),
  asyncHandler(controller.removeFamilyRelation),
);

export default router;
