import { Request, Response } from 'express';
import * as formationService from '../services/formation.service';
import {
  CreateFormationInput,
  UpdateFormationInput,
  AddFormationMemberInput,
  UpdateFormationMemberInput,
} from '../types/session.types';


export const getMemberAssignments = async (_req: Request, res: Response) => {
  const data = await formationService.getMemberAssignmentOverview();
  res.json({ success: true, data });
};

export const getAll = async (_req: Request, res: Response) => {
  const data = await formationService.getAllFormations();
  res.json({ success: true, data });
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const data = await formationService.getFormationById(id);
  res.json({ success: true, data });
};

export const create = async (req: Request, res: Response) => {
  const input = req.validated!.body as CreateFormationInput;
  const data = await formationService.createFormation(input);
  res.status(201).json({ success: true, data });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const input = req.validated!.body as UpdateFormationInput;
  const data = await formationService.updateFormation(id, input);
  res.json({ success: true, data });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  await formationService.deleteFormation(id);
  res.status(204).send();
};

export const addMember = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const input = req.validated!.body as AddFormationMemberInput;
  const data = await formationService.addFormationMember(id, input);
  res.status(201).json({ success: true, data });
};

export const updateMember = async (req: Request, res: Response) => {
  const { id, membershipNumber } = req.validated!.params as {
    id: number;
    membershipNumber: number;
  };
  const input = req.validated!.body as UpdateFormationMemberInput;
  const data = await formationService.updateFormationMember(id, membershipNumber, input);
  res.json({ success: true, data });
};

export const removeMember = async (req: Request, res: Response) => {
  const { id, membershipNumber } = req.validated!.params as {
    id: number;
    membershipNumber: number;
  };
  await formationService.removeFormationMember(id, membershipNumber);
  res.status(204).send();
};
