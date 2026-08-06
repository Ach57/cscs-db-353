import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/AppError';

type RequestPart = 'body' | 'params' | 'query';

/**
 * Generic validation middleware factory. Parses/coerces req[part] against
 * the given schema and stores the result on req.validated[part] rather than
 * overwriting req.body/req.params directly (which Express types as plain
 * strings -- overwriting them with coerced numbers/objects fights the
 * compiler under strict mode).
 *
 * Usage: router.post('/', validate(createLocationSchema), controller.create)
 */
export const validate =
  (schema: ZodSchema, part: RequestPart = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const message = result.error.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      return next(new ValidationError(message));
    }
    req.validated = { ...req.validated, [part]: result.data };
    next();
  };
