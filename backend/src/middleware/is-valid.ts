import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import ValidationError from '../error/validation-error';

export default function validateData(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const message: string = errors.array()[0].msg;
        const { value } = errors.array()[0];
        const { param } = errors.array()[0];
        const status = 400;
        return next(new ValidationError(message, value, param, status));
    }
    return next();
}
