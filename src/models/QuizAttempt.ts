import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IQuizAttempt extends Document {
  userId: Types.ObjectId;
  quizId: Types.ObjectId;
  answers: number[];
  score: number;
  passed: boolean;
  timeUsed: number;
  xpEarned: number;
  completedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  answers: [Number],
  score: Number,
  passed: Boolean,
  timeUsed: Number, // seconds
  xpEarned: Number,
  completedAt: { type: Date, default: Date.now },
});

export const QuizAttempt: Model<IQuizAttempt> =
  mongoose.models.QuizAttempt ||
  mongoose.model<IQuizAttempt>("QuizAttempt", QuizAttemptSchema);
