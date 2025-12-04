import { Router } from "express";
import { compileCpp } from "../../sandbox/runner.js";

import upload from "../middlewares/upload.js";
const router = Router();
import *as controller from "../controllers/problem.controller.js"

router.get("/",controller.index);
router.get("/:id", controller.getProblem);
router.post("/submit",upload.single("codefile"),controller.submitCode);
export default router