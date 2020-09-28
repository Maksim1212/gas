import { Router } from 'express';
import * as asyncHandler from 'express-async-handler';

import { userDataValidation, unsubscribeValidation } from '../validations/user-validation';
import * as UserController from '../controllers/user-controller';

const userRouter = Router();

userRouter.get('/', asyncHandler(UserController.findAll));

userRouter.post('/create', userDataValidation, asyncHandler(UserController.createUser));

userRouter.get('/unsubscribe', unsubscribeValidation, asyncHandler(UserController.unsubscribe));

// userRouter.post('/send', asyncHandler(UserController.sendMail));

export default userRouter;
