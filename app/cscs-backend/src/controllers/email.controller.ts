import { Request, Response } from 'express';
import * as emailService from '../services/email.service';
import { CreateEmailLogInput } from '../types/email.types';

export const getAll = async (_req: Request, res: Response) => {
  const data = await emailService.getAllEmailLogs();
  res.json({ success: true, data });
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const data = await emailService.getEmailLogById(id);
  res.json({ success: true, data });
};

export const create = async (req: Request, res: Response) => {
  const input = req.validated!.body as CreateEmailLogInput;
  const data = await emailService.createEmailLog(input);
  res.status(201).json({ success: true, data });
};
