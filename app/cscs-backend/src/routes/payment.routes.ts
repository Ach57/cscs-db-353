import { Router } from 'express';
import * as controller from '../controllers/payment.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { paymentIdParamSchema, memberFinancialParamsSchema, createPaymentSchema, updatePaymentSchema } from '../types/payment.types';

const router = Router();

router.get('/', asyncHandler(controller.getAll));
router.get('/:id', validate(paymentIdParamSchema, 'params'), asyncHandler(controller.getOne));
router.post('/', validate(createPaymentSchema), asyncHandler(controller.create));
router.put('/:id', validate(paymentIdParamSchema, 'params'), validate(updatePaymentSchema), asyncHandler(controller.update));
router.get('/member/:membershipNumber/year/:year', validate(memberFinancialParamsSchema, 'params'), asyncHandler(controller.getMemberSummary));
router.delete('/:id', validate(paymentIdParamSchema, 'params'), asyncHandler(controller.remove));

export default router;
