import { Request, Response, NextFunction } from 'express';
import { send_error } from '../utils/response';

export const error_handler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Error:', err);

  const status_code = (err as any).status_code || 500;
  const message = err.message || 'Internal server error';

  send_error(res, message, 'Server error', status_code);
};

export const not_found_handler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  send_error(res, `Route ${req.originalUrl} not found`, 'Not found', 404);
};
