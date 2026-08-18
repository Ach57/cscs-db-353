import { Request, Response } from 'express';
import * as sessionService from '../services/session.service';
import { CreateSessionInput, UpdateSessionInput } from '../types/session.types';

export const getAll = async (_req: Request, res: Response) => {
  const data = await sessionService.getAllSessions();
  res.json({ success: true, data });
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const data = await sessionService.getSessionById(id);
  res.json({ success: true, data });
};

export const create = async (req: Request, res: Response) => {
  const input = req.validated!.body as CreateSessionInput;
  const data = await sessionService.createSession(input);
  res.status(201).json({ success: true, data });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const input = req.validated!.body as UpdateSessionInput;
  const data = await sessionService.updateSession(id, input);
  res.json({ success: true, data });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  await sessionService.deleteSession(id);
  res.status(204).send();
};
