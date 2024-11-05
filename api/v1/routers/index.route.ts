import {Express} from 'express';

import {taskRoute} from "./tasks.route";

import {userRoute} from "./user.route";

import * as authMiddleware from '../middleware/auth.middleware'

const mainV1Route = (app : Express) : void=>{

  const version = "/api/v1"

  app.use(`${version}/tasks`,authMiddleware.requireAuth, taskRoute);

  app.use(`${version}/users`,userRoute);
}

export default mainV1Route;