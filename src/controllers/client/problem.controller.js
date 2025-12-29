import Problem from "../../model/problem.model.js";
import Testcase from "../../model/testcase.model.js";
import { saveCodeToFile, compileCpp, runCpp } from "../../../sandbox/runner.js";
// GET /problem
export const index = async (req, res) => {
  try {
    const problems = await Problem.find().select("title description difficulty");
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /problem/:id
export const getProblem = async (req, res) => {
  try {
    const id = req.params.id;
    //console.log("hihih")
    const problems = await Problem.findOne({
      _id: id
    }).select("title description");
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const submitCode = async (req, res) => {
  try {

    const { problemId, code } = req.body;
    let cppPath = "";
    //console.log(problemId)

    // Lấy thông tin đề bài (time limit + memory limit)
    const problem = await Problem.findById(problemId);
    const timeLimit = problem.time_limit || 1000; // ms
    const memoryLimit = problem.memory_limit || 256; // MB


    if (req.file) {
      cppPath = req.file.path;
    } else if (code) {
      // 1. Save file
      await saveCodeToFile(code);
    }



    // 2. Compile
    const compileResult = await compileCpp();

    // 3. Nếu compile lỗi → trả luôn kết quả
    if (!compileResult.success) {
      return res.json({
        status: "CE",
        error: compileResult.error
      });
    }
    //const testcases1 = await Testcase.find();
    //console.log(testcases1);
    // 3. Lấy testcases của problem
    const testcases = await Testcase.find({ problem_id: problemId });
    //console.log(testcases);
    let results = [];
    let passed = 0;
    let finalStatus = "AC"; // mặc định

    // 4. Chạy từng test case
    for (let tc of testcases) {
      const r = await runCpp(tc.input, timeLimit, memoryLimit);

      let actual = (r.stdout || "").trim();
      const expected = tc.output.trim();
      let isPass = false;
      let caseStatus = "AC";


      // -- Check lỗi theo thứ tự ưu tiên --
      if (r.status === "TLE") {
        caseStatus = "TLE";
        finalStatus = "TLE";
      }
      else if (r.status === "MLE") {
        caseStatus = "MLE";
        finalStatus = "MLE";
      }
      else if (r.status === "RTE") {
        caseStatus = "RE";
        finalStatus = "RE";
      }
      else if (r.status === "OK") {
        if (actual !== expected) {
          caseStatus = "WA";
          if (finalStatus === "AC") finalStatus = "WA";
        }
      }
      // if (r.status === "OK") {
      //     actual = r.stdout.trim();
      //     isPass = actual === expected;
      // } else {
      //     actual = r.stderr;
      //     isPass = false;
      // }


      //if (isPass) passed++;


      results.push({

        input: tc.input,
        expected,
        actual,
        //pass: isPass,
        status: caseStatus,
        time: r.time,
        memory: r.memory
      });


      // Nếu gặp lỗi nặng → dừng sớm
      if (["TLE", "MLE", "RE"].includes(caseStatus)) break;
    }

    // 5. Trả kết quả cuối
    return res.json({
      status: finalStatus,
      results
      // status: "done",
      // total: testcases.length,
      // passed,
      // time_limit: timeLimit,
      // memory_limit: memoryLimit,
      // results
    });


  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

};