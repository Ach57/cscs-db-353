import { Router } from 'express';
import * as controller from '../controllers/location.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  createLocationSchema,
  updateLocationSchema,
  locationIdParamSchema,
  locationPhoneParamsSchema,
  createLocationPhoneSchema,
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

router.get('/:id/phones', validate(locationIdParamSchema, 'params'), asyncHandler(controller.getPhones));
router.post('/:id/phones', validate(locationIdParamSchema, 'params'), validate(createLocationPhoneSchema), asyncHandler(controller.addPhone));
router.delete('/:id/phones/:phoneNumber', validate(locationPhoneParamsSchema, 'params'), asyncHandler(controller.removePhone));

router.delete('/:id', validate(locationIdParamSchema, 'params'), asyncHandler(controller.remove));

export default router;
