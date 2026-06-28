import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface IQuiz extends Document {
  moduleId: Types.ObjectId;
  title: string;
  description: string;
  timeLimit?: number | null;
  questions: IQuestion[];
  passingScore: number;
  xpReward: number;
  shuffleQuestions: boolean;
}

const QuestionSchema = new Schema<IQuestion>({
  question: String,
  options: [String],
  correct: Number,
  explanation: String,
  points: { type: Number, default: 1 },
  difficulty: { type: String, enum: ["easy", "medium", "hard"] },
});

const QuizSchema = new Schema<IQuiz>({
  moduleId: { type: Schema.Types.ObjectId, ref: "Module" },
  title: String,
  description: String,
  timeLimit: { type: Number, default: null }, // seconds
  questions: [QuestionSchema],
  passingScore: { type: Number, default: 70 },
  xpReward: Number,
  shuffleQuestions: { type: Boolean, default: true },
});

export const Quiz: Model<IQuiz> =
  mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);
