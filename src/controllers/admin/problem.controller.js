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


/**
 * POST /admin/problems
 * Tạo bài mới
 */
export const createProblem = async (req, res) => {
  try {
    const { title, description, timeLimit, memoryLimit } = req.body;

    // validate bắt buộc
    if (
      !title ||
      !description ||
      timeLimit === undefined ||
      memoryLimit === undefined
    ) {
      return res.status(400).json({
        message: "Thiếu dữ liệu: title, description, timeLimit, memoryLimit"
      });
    }

    // validate giá trị
    if (timeLimit <= 0 || memoryLimit <= 0) {
      return res.status(400).json({
        message: "timeLimit và memoryLimit phải > 0"
      });
    }

    const problem = await Problem.create({
      title,
      description,
      timeLimit,
      memoryLimit
    });

    res.status(201).json({
      message: "Tạo bài thành công",
      data: problem
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * PUT /admin/problems/:id
 * Cập nhật bài
 */
export const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, timeLimit, memoryLimit } = req.body;

    // validate bắt buộc
    if (
      !title ||
      !description ||
      timeLimit === undefined ||
      memoryLimit === undefined
    ) {
      return res.status(400).json({
        message: "Thiếu dữ liệu: title, description, timeLimit, memoryLimit"
      });
    }

    if (timeLimit <= 0 || memoryLimit <= 0) {
      return res.status(400).json({
        message: "timeLimit và memoryLimit phải > 0"
      });
    }

    const problem = await Problem.findByIdAndUpdate(
      id,
      {
        title,
        description,
        timeLimit,
        memoryLimit
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!problem) {
      return res.status(404).json({
        message: "Không tìm thấy bài"
      });
    }

    res.json({
      message: "Cập nhật bài thành công",
      data: problem
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
