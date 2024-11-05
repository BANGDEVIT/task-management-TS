import { Router } from "express";
import * as taskController from "../controller/task.controller"

const route : Router = Router();

route.get('/', taskController.tasks);

route.get('/detail/:id', taskController.detail);

route.patch("/change-status/:id",taskController.changeStatus);

route.patch("/change-multi",taskController.changeMulti);

route.post("/create",taskController.create);

route.patch("/edit/:id",taskController.edit);

route.patch("/delete/:id",taskController.deleteTask);

export const taskRoute : Router = route;