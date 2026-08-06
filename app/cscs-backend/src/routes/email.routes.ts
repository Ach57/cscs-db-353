import { Router } from 'express';
import * as controller from '../controllers/email.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { emailIdParamSchema, createEmailLogSchema } from '../types/email.types';

const router = Router();

router.get('/', asyncHandler(controller.getAll));
router.get('/:id', validate(emailIdParamSchema, 'params'), asyncHandler(controller.getOne));
router.post('/', validate(createEmailLogSchema), asyncHandler(controller.create));

export default router;
