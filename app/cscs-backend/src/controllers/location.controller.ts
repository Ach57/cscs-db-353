import { Request, Response } from "express";
import * as locationService from "../services/location.service";
import {
  CreateLocationInput,
  UpdateLocationInput,
} from "../types/location.types";

export const getAll = async (_req: Request, res: Response) => {
  const locations = await locationService.getAllLocations();
  res.json({ success: true, data: locations });
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const location = await locationService.getLocationById(id);
  res.json({ success: true, data: location });
};

export const create = async (req: Request, res: Response) => {
  const input = req.validated!.body as CreateLocationInput;
  const location = await locationService.createLocation(input);
  res.status(201).json({ success: true, data: location });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const input = req.validated!.body as UpdateLocationInput;
  const location = await locationService.updateLocation(id, input);
  res.json({ success: true, data: location });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  await locationService.deleteLocation(id);
  res.status(204).send();
};


export const getPhones = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  res.json({ success: true, data: await locationService.getLocationPhones(id) });
};

export const addPhone = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const { phone_number } = req.validated!.body as { phone_number: string };
  res.status(201).json({ success: true, data: await locationService.addLocationPhone(id, phone_number) });
};

export const removePhone = async (req: Request, res: Response) => {
  const { id, phoneNumber } = req.validated!.params as { id: number; phoneNumber: string };
  await locationService.removeLocationPhone(id, phoneNumber);
  res.status(204).send();
};
