import { body, query } from 'express-validator';
import validateData from '../middleware/is-valid';

const userDataValidation = [
    body('email').isEmail().trim(),
    body('threshold').isLength({ min: 1, max: 12 }).trim(),
    validateData,
];
const unsubscribeValidation = [query('uuid').isString().isLength({ min: 20, max: 50 }).trim(), validateData];

export { userDataValidation, unsubscribeValidation };
