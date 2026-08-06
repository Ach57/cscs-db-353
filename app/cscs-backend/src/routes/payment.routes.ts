import { Router } from 'express';
import * as controller from '../controllers/payment.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { paymentIdParamSchema, createPaymentSchema } from '../types/payment.types';

const router = Router();

router.get('/', asyncHandler(controller.getAll));
router.get('/:id', validate(paymentIdParamSchema, 'params'), asyncHandler(controller.getOne));
router.post('/', validate(createPaymentSchema), asyncHandler(controller.create));
router.delete('/:id', validate(paymentIdParamSchema, 'params'), asyncHandler(controller.remove));

export default router;
