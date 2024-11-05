import {Router} from 'express';

const route = Router();

import * as userController from '../controller/user.controller'

import * as authMiddleware from '../middleware/auth.middleware'

route.post("/register",userController.register);

route.post("/login",userController.login);

route.post("/password/forgot",userController.forgotPassword);

route.post("/password/otp",userController.otpPassword);

// route.post("/password/reset",userController.resetPassword);

route.get("/detail",authMiddleware.requireAuth,userController.detail);

route.get("/list",authMiddleware.requireAuth,userController.list);

export const userRoute : Router = route;
