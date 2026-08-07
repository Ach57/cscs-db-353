import { Request, Response } from 'express';
import * as familyMemberService from '../services/family-member.service';
import {
  CreateFamilyMemberInput,
  UpdateFamilyMemberInput,
  CreateFamilyMemberAssignmentInput,
  UpdateFamilyMemberAssignmentInput,
} from '../types/family-member.types';

export const getAll = async (_req: Request, res: Response) => {
  const data = await familyMemberService.getAllFamilyMembers();
  res.json({ success: true, data });
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const data = await familyMemberService.getFamilyMemberById(id);
  res.json({ success: true, data });
};

export const create = async (req: Request, res: Response) => {
  const input = req.validated!.body as CreateFamilyMemberInput;
  const data = await familyMemberService.createFamilyMember(input);
  res.status(201).json({ success: true, data });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const input = req.validated!.body as UpdateFamilyMemberInput;
  const data = await familyMemberService.updateFamilyMember(id, input);
  res.json({ success: true, data });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  await familyMemberService.deleteFamilyMember(id);
  res.status(204).send();
};

export const getAssignments = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const data = await familyMemberService.getFamilyMemberAssignments(id);
  res.json({ success: true, data });
};

export const createAssignment = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const input = req.validated!.body as CreateFamilyMemberAssignmentInput;
  const data = await familyMemberService.createFamilyMemberAssignment(id, input);
  res.status(201).json({ success: true, data });
};

export const updateAssignment = async (req: Request, res: Response) => {
  const { assignmentId } = req.validated!.params as { id: number; assignmentId: number };
  const input = req.validated!.body as UpdateFamilyMemberAssignmentInput;
  const data = await familyMemberService.updateFamilyMemberAssignment(assignmentId, input);
  res.json({ success: true, data });
};

export const removeAssignment = async (req: Request, res: Response) => {
  const { assignmentId } = req.validated!.params as { id: number; assignmentId: number };
  await familyMemberService.deleteFamilyMemberAssignment(assignmentId);
  res.status(204).send();
};
