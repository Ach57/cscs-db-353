import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';
import { CreatePaymentInput } from '../types/payment.types';

export const getAll = async (_req: Request, res: Response) => {
  const data = await paymentService.getAllPayments();
  res.json({ success: true, data });
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const data = await paymentService.getPaymentById(id);
  res.json({ success: true, data });
};

export const create = async (req: Request, res: Response) => {
  const input = req.validated!.body as CreatePaymentInput;
  const data = await paymentService.createPayment(input);
  res.status(201).json({ success: true, data });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  await paymentService.deletePayment(id);
  res.status(204).send();
};
