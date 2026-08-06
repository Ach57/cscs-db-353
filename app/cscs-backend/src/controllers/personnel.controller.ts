import { Request, Response } from 'express';
import * as personnelService from '../services/personnel.service';
import {
  CreatePersonnelInput,
  UpdatePersonnelInput,
  CreatePersonnelAssignmentInput,
  UpdatePersonnelAssignmentInput,
} from '../types/personnel.types';

export const getAll = async (_req: Request, res: Response) => {
  const data = await personnelService.getAllPersonnel();
  res.json({ success: true, data });
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const data = await personnelService.getPersonnelById(id);
  res.json({ success: true, data });
};

export const create = async (req: Request, res: Response) => {
  const input = req.validated!.body as CreatePersonnelInput;
  const data = await personnelService.createPersonnel(input);
  res.status(201).json({ success: true, data });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const input = req.validated!.body as UpdatePersonnelInput;
  const data = await personnelService.updatePersonnel(id, input);
  res.json({ success: true, data });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  await personnelService.deletePersonnel(id);
  res.status(204).send();
};

export const getAssignments = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const data = await personnelService.getPersonnelAssignments(id);
  res.json({ success: true, data });
};

export const createAssignment = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const input = req.validated!.body as CreatePersonnelAssignmentInput;
  const data = await personnelService.createPersonnelAssignment(id, input);
  res.status(201).json({ success: true, data });
};

export const updateAssignment = async (req: Request, res: Response) => {
  const { assignmentId } = req.validated!.params as { id: number; assignmentId: number };
  const input = req.validated!.body as UpdatePersonnelAssignmentInput;
  const data = await personnelService.updatePersonnelAssignment(assignmentId, input);
  res.json({ success: true, data });
};

export const removeAssignment = async (req: Request, res: Response) => {
  const { assignmentId } = req.validated!.params as { id: number; assignmentId: number };
  await personnelService.deletePersonnelAssignment(assignmentId);
  res.status(204).send();
};
