import { Response } from 'express';
import { api_response } from '../types';

export const send_success = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  status_code: number = 200
): Response => {
  const response: api_response<T> = {
    success: true,
    message,
    data,
  };
  return res.status(status_code).json(response);
};

export const send_error = (
  res: Response,
  error: string,
  message: string = 'Error occurred',
  status_code: number = 500
): Response => {
  const response: api_response<null> = {
    success: false,
    message,
    error,
  };
  return res.status(status_code).json(response);
};

export const send_validation_error = (
  res: Response,
  errors: string[]
): Response => {
  return send_error(res, errors.join(', '), 'Validation failed', 400);
};

export const send_not_found = (
  res: Response,
  resource: string = 'Resource'
): Response => {
  return send_error(res, `${resource} not found`, 'Not found', 404);
};
