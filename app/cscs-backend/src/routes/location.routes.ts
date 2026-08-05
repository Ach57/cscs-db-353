import { Router } from 'express';
import * as controller from '../controllers/location.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  createLocationSchema,
  updateLocationSchema,
  locationIdParamSchema,
} from '../types/location.types';

const router = Router();

router.get('/', asyncHandler(controller.getAll));

router.get('/:id', validate(locationIdParamSchema, 'params'), asyncHandler(controller.getOne));

router.post('/', validate(createLocationSchema), asyncHandler(controller.create));

router.put(
  '/:id',
  validate(locationIdParamSchema, 'params'),
  validate(updateLocationSchema),
  asyncHandler(controller.update),
);

router.delete('/:id', validate(locationIdParamSchema, 'params'), asyncHandler(controller.remove));

export default router;
