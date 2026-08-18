import { Request, Response } from 'express';
import * as fifaService from '../services/fifa.service';
import { CreateFIFAGameInput, UpdateFIFAGameInput, AddParticipantInput } from '../types/fifa.types';

export const getAll = async (_req: Request, res: Response) => {
  const data = await fifaService.getAllGames();
  res.json({ success: true, data });
};

export const getParticipantOverview = async (_req: Request, res: Response) => {
  const data = await fifaService.getParticipantOverview();
  res.json({ success: true, data });
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const data = await fifaService.getGameById(id);
  res.json({ success: true, data });
};

export const create = async (req: Request, res: Response) => {
  const input = req.validated!.body as CreateFIFAGameInput;
  const data = await fifaService.createGame(input);
  res.status(201).json({ success: true, data });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const input = req.validated!.body as UpdateFIFAGameInput;
  const data = await fifaService.updateGame(id, input);
  res.json({ success: true, data });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  await fifaService.deleteGame(id);
  res.status(204).send();
};

export const addParticipant = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const input = req.validated!.body as AddParticipantInput;
  const data = await fifaService.addParticipant(id, input);
  res.status(201).json({ success: true, data });
};

export const removeParticipant = async (req: Request, res: Response) => {
  const { id, membershipNumber } = req.validated!.params as {
    id: number;
    membershipNumber: number;
  };
  await fifaService.removeParticipant(id, membershipNumber);
  res.status(204).send();
};
