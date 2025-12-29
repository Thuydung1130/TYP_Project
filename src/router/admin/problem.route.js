import { Router } from "express";

const router = Router();

import *as controller from "../../controllers/admin/problem.controller.js"


router.get("/",controller.index);


router.get("/:id", controller.getProblem);
router.post("/", controller.createProblem);
router.put("/:id", controller.updateProblem);


export default router