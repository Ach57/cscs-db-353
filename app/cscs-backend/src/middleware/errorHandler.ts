import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

interface MysqlError extends Error {
  code?: string;
  errno?: number;
  sqlState?: string;
  sqlMessage?: string;
  sql?: string;
}

function isMysqlError(error: unknown): error is MysqlError {
  return error instanceof Error && typeof (error as MysqlError).code === 'string';
}

function quotedParts(message: string): string[] {
  return [...message.matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

function mysqlClientError(error: MysqlError) {
  const rawMessage = error.sqlMessage || error.message;
  const quoted = quotedParts(rawMessage);
  let statusCode = 400;
  let message = rawMessage;
  let constraint: string | undefined;
  let field: string | undefined;
  let value: string | undefined;

  switch (error.code) {
    case 'ER_DUP_ENTRY':
      statusCode = 409;
      value = quoted[0];
      constraint = quoted[1];
      field = constraint?.replace(/^.*\./, '').replace(/^uniq(?:ue)?_?/i, '').replace(/_/g, ' ');
      message = field
        ? `Duplicate value${value ? ` "${value}"` : ''} for ${field}. This value must be unique.`
        : `Duplicate value${value ? ` "${value}"` : ''}. This value must be unique.`;
      break;
    case 'ER_NO_REFERENCED_ROW_2':
      statusCode = 409;
      constraint = quoted[quoted.length - 1];
      message = 'A referenced record does not exist. Check the related ID values.';
      break;
    case 'ER_ROW_IS_REFERENCED_2':
      statusCode = 409;
      constraint = quoted[quoted.length - 1];
      message = 'This record cannot be deleted because other records still reference it.';
      break;
    case 'ER_BAD_NULL_ERROR':
      field = quoted[0];
      message = field ? `${field} is required and cannot be null.` : rawMessage;
      break;
    case 'ER_DATA_TOO_LONG':
      field = quoted[0];
      message = field ? `${field} is longer than the database allows.` : rawMessage;
      break;
    case 'ER_WARN_DATA_OUT_OF_RANGE':
      field = quoted[0];
      message = field ? `${field} is outside the allowed numeric range.` : rawMessage;
      break;
    case 'ER_TRUNCATED_WRONG_VALUE':
    case 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD':
      field = quoted[quoted.length - 1];
      message = field ? `Invalid value supplied for ${field}.` : rawMessage;
      break;
    case 'ER_CHECK_CONSTRAINT_VIOLATED':
      constraint = quoted[0];
      message = constraint ? `Database check constraint failed: ${constraint}.` : rawMessage;
      break;
    case 'ER_SIGNAL_EXCEPTION':
      // SIGNAL messages come from project triggers and contain the most useful rule explanation.
      statusCode = 409;
      message = rawMessage;
      break;
    default:
      statusCode = 400;
      message = rawMessage;
  }

  return {
    statusCode,
    payload: {
      message,
      type: 'database',
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      constraint,
      field,
      value,
      databaseMessage: rawMessage,
      ...(env.NODE_ENV === 'development' && error.sql ? { sql: error.sql } : {}),
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, type: 'application' },
    });
  }

  if (isMysqlError(err)) {
    console.error('Database error:', err);
    const { statusCode, payload } = mysqlClientError(err);
    return res.status(statusCode).json({ success: false, error: payload });
  }

  console.error('Unhandled error:', err);

  return res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      type: 'internal',
      ...(env.NODE_ENV === 'development' && err instanceof Error ? { detail: err.message } : {}),
    },
  });
}
