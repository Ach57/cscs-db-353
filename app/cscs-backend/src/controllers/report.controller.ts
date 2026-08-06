import { Request, Response } from 'express';
import * as service from '../services/report.service';

export const catalog = async (_req: Request, res: Response) => res.json({ success: true, data: service.getReportCatalog() });
export const run = async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: number };
  const params = (req.validated!.query ?? {}) as Record<string, unknown>;
  res.json({ success: true, data: await service.runReport(id, params) });
};
