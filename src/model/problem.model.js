import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  timeLimit: { type: Number, default: 1000 }, // ms
  memoryLimit: { type: Number, default: 256 }  // MB
});

export default mongoose.model("problems", ProblemSchema);
