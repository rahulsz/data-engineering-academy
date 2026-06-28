import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInterviewQuestion extends Document {
  topic: string;
  subtopic: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  type: "conceptual" | "coding" | "scenario" | "system_design";
  company: string[];
  tags: string[];
  upvotes: number;
  order: number;
}

const InterviewQuestionSchema = new Schema<IInterviewQuestion>({
  topic: String,
  subtopic: String,
  question: String,
  answer: String,
  difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  type: {
    type: String,
    enum: ["conceptual", "coding", "scenario", "system_design"],
  },
  company: [String],
  tags: [String],
  upvotes: { type: Number, default: 0 },
  order: Number,
});

export const InterviewQuestion: Model<IInterviewQuestion> =
  mongoose.models.InterviewQuestion ||
  mongoose.model<IInterviewQuestion>("InterviewQuestion", InterviewQuestionSchema);
