import Testcase from "../../model/testcase.model.js";




/**
 * GET /admin/problems/:problemId/testcases
 * Lấy danh sách test case của 1 problem
 */
export const getTestCases = async (req, res) => {
  try {
    const { problem_id } = req.query;

    const filter = problem_id ? { problem_id } : {};

    const testcases = await Testcase.find(filter).sort({ _id: 1 });

    res.json({
      data: testcases
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /admin/problems/:problemId/testcases
 * Thêm test case
 */
export const createTestcase = async (req, res) => {
  try {
    const { problem_id } = req.params;
    const { testcases } = req.body;

    if (!Array.isArray(testcases) || testcases.length === 0) {
      return res.status(400).json({
        message: "testcases phải là mảng và không được rỗng"
      });
    }

     // Validate từng testcase
    const docs = testcases.map((tc, index) => {
      if (!tc.input || !tc.output) {
        throw new Error(`Testcase tại vị trí ${index} thiếu input hoặc output`);
      }

      return {
        problem_id: problem_id,
        input: tc.input,
        output: tc.output
      };
    });

    const inserted = await Testcase.insertMany(docs);

    res.status(201).json({
      message: "Thêm test case thành công",
      total: inserted.length,
      data: inserted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




/**
 * PUT /admin/testcases/:id
 * Sửa test case
 */
export const updateTestcase = async (req, res) => {
  try {
    const { id } = req.params;
    const { input, output } = req.body;

    const testcase = await Testcase.findByIdAndUpdate(
      id,
      { input, output },
      { new: true }
    );

    if (!testcase) {
      return res.status(404).json({
        message: "Không tìm thấy test case"
      });
    }

    res.json({
      message: "Cập nhật test case thành công",
      data: testcase
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /admin/testcases/:id
 * Xoá test case
 */
export const deleteTestcase = async (req, res) => {
  try {
    const { id } = req.params;

    const testcase = await Testcase.findByIdAndDelete(id);

    if (!testcase) {
      return res.status(404).json({
        message: "Không tìm thấy test case"
      });
    }

    res.json({
      message: "Xoá test case thành công"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
