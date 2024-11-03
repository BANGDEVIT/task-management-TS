import {Express} from 'express';

import {taskRoute} from "./tasks.route";

const mainV1Route = (app : Express) : void=>{

  const version = "/api/v1"

  app.use(`${version}/tasks`, taskRoute);
}

export default mainV1Route;