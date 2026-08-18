import { Request, Response } from 'express';
import * as clubMemberService from '../services/club-member.service';
import {
  CreateClubMemberInput,
  UpdateClubMemberInput,
  AddHobbyInput,
  CreateHobbyInput,
  CreateFamilyRelationInput,
  UpdateFamilyRelationInput,
  CreateFlatFamilyRelationInput,
} from '../types/club-member.types';

// ── Club Members ─────────────────────────────────────────────────────────────

export const getAll = async (_req: Request, res: Response) => {
  const data = await clubMemberService.getAllClubMembers();
  res.json({ success: true, data });
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const data = await clubMemberService.getClubMemberById(id);
  res.json({ success: true, data });
};

export const create = async (req: Request, res: Response) => {
  const input = req.validated!.body as CreateClubMemberInput;
  const data = await clubMemberService.createClubMember(input);
  res.status(201).json({ success: true, data });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const input = req.validated!.body as UpdateClubMemberInput;
  const data = await clubMemberService.updateClubMember(id, input);
  res.json({ success: true, data });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  await clubMemberService.deleteClubMember(id);
  res.status(204).send();
};

// ── Hobbies catalog ──────────────────────────────────────────────────────────

export const getAllHobbies = async (_req: Request, res: Response) => {
  const data = await clubMemberService.getAllHobbies();
  res.json({ success: true, data });
};

export const createHobby = async (req: Request, res: Response) => {
  const input = req.validated!.body as CreateHobbyInput;
  const data = await clubMemberService.createHobby(input);
  res.status(201).json({ success: true, data });
};

export const removeHobby = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  await clubMemberService.deleteHobby(id);
  res.status(204).send();
};

// ── Member–Hobby relations ───────────────────────────────────────────────────

export const getMemberHobbies = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const data = await clubMemberService.getMemberHobbies(id);
  res.json({ success: true, data });
};

export const addMemberHobby = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const { hobby_id } = req.validated!.body as AddHobbyInput;
  const data = await clubMemberService.addMemberHobby(id, hobby_id);
  res.status(201).json({ success: true, data });
};

export const removeMemberHobby = async (req: Request, res: Response) => {
  const { id, hobbyId } = req.validated!.params as { id: number; hobbyId: number };
  await clubMemberService.removeMemberHobby(id, hobbyId);
  res.status(204).send();
};

// ── Family relations ─────────────────────────────────────────────────────────
export const getAllFamilyRelationsFlat = async (_req: Request, res: Response) => {
  const data = await clubMemberService.getAllFamilyRelations();
  res.json({ success: true, data });
};

export const createFlatFamilyRelation = async (req: Request, res: Response) => {
  const input = req.validated!.body as CreateFlatFamilyRelationInput;
  const data = await clubMemberService.createFlatFamilyRelation(input);
  res.status(201).json({ success: true, data });
};
export const getFamilyRelations = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const data = await clubMemberService.getMemberFamilyRelations(id);
  res.json({ success: true, data });
};

export const createFamilyRelation = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const input = req.validated!.body as CreateFamilyRelationInput;
  const data = await clubMemberService.createFamilyRelation(id, input);
  res.status(201).json({ success: true, data });
};

export const updateFamilyRelation = async (req: Request, res: Response) => {
  const { relationId } = req.validated!.params as { id: number; relationId: number };
  const input = req.validated!.body as UpdateFamilyRelationInput;
  const data = await clubMemberService.updateFamilyRelation(relationId, input);
  res.json({ success: true, data });
};

export const removeFamilyRelation = async (req: Request, res: Response) => {
  const { relationId } = req.validated!.params as { id: number; relationId: number };
  await clubMemberService.deleteFamilyRelation(relationId);
  res.status(204).send();
};
