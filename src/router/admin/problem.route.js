import { Router } from "express";

const router = Router();

import *as controller from "../../controllers/admin/problem.controller.js"


router.get("/",controller.index);

router.get("/:id", controller.getProblem);

export default router