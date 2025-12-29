import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },
    // ⭐ độ khó bài toán
    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      default: "EASY",
      required: true
    },

    // giống DB: time_limit (ms)
    timeLimit: {
      type: Number,
      required: true,
      default: 1000
    },

    // giống DB: memory_limit (MB)
    memoryLimit: {
      type: Number,
      required: true,
      default: 256
    }
  }
  
);

export default mongoose.model("problems", ProblemSchema);
