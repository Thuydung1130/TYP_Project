import Problem from "../../model/problem.model.js";
import Testcase from "../../model/testcase.model.js";


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
