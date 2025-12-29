import { Router } from "express";

const router = Router();

import *as controller from "../../controllers/admin/testcase.controller.js"


//lay all testcase
router.get("/",controller.getTestCases);


// thêm test case
router.post("/:problem_id", controller.createTestcase);

// sửa test case
router.put("/:id", controller.updateTestcase);

// xoá test case
router.delete("/:id", controller.deleteTestcase);

export default router;