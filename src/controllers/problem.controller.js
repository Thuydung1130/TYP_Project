import Problem from "../model/problem.model.js";
import Testcase from "../model/testcase.model.js";
import { saveCodeToFile, compileCpp,runCpp } from "../../sandbox/runner.js";
// GET /problem
export const index = async (req, res) => {
  try {
    const problems = await Problem.find().select("title description");
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /problem/:id
export const getProblem = async (req, res) => {
  try {
    const id=req.params.id;
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
    let cppPath="";
    //console.log(problemId)
    if (req.file) {
      cppPath = req.file.path;
    } else if(code){
      // 1. Save file
      await saveCodeToFile(code);
    }
    
    

    // 2. Compile
    const compileResult = await compileCpp();

    // 3. Nếu compile lỗi → trả luôn kết quả
    if (!compileResult.success) {
        return res.json({
            status: "compile_error",
            error: compileResult.error
        });
    }
    //const testcases1 = await Testcase.find();
    //console.log(testcases1);
    // 3. Lấy testcases của problem
        const testcases = await Testcase.find({ problem_id :problemId});
        console.log(testcases);
        let results = [];
        let passed = 0;

        // 4. Chạy từng test case
        for (let tc of testcases) {
            const r = await runCpp(tc.input);

            const actual = r.output || r.error;
            const expected = tc.output.trim();
            const isPass = r.success && actual == expected;
            console.log(actual ,expected);
            if (isPass) passed++;
           console.log(actual,expected)
            results.push({
                input: tc.input,
                expected,
                actual,
                pass: isPass
            });
        }

        // 5. Trả kết quả cuối
        return res.json({
            status: "done",
            total: testcases.length,
            passed,
            results
        });

   
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
    
};