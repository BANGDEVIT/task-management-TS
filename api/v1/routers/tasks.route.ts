import { Router } from "express";
import * as taskController from "../controller/task.controller"

const route : Router = Router();

route.get('/', taskController.tasks);

route.get('/detail/:id', taskController.detail);

export const taskRoute : Router = route;