import mongoose from "mongoose";

const TestcaseSchema = new mongoose.Schema({
  problem_id: { type: String, required: true },
  input: { type: String, required: true },
  output: { type: String, required: true }
});

export default mongoose.model("test-cases", TestcaseSchema);
