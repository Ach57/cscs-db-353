import { Router } from 'express';
import * as controller from '../controllers/club-member.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { hobbyIdParamSchema, createHobbySchema } from '../types/club-member.types';

const router = Router();

router.get('/', asyncHandler(controller.getAllHobbies));
router.post('/', validate(createHobbySchema), asyncHandler(controller.createHobby));
router.delete('/:id', validate(hobbyIdParamSchema, 'params'), asyncHandler(controller.removeHobby));

export default router;
