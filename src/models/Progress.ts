import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProgress extends Document {
  userId: Types.ObjectId;
  lessonId: Types.ObjectId;
  moduleId: Types.ObjectId;
  courseId: Types.ObjectId;
  status: "not_started" | "in_progress" | "completed";
  score?: number;
  timeSpent: number;
  xpEarned?: number;
  attempts: number;
  completedAt?: Date;
}

const ProgressSchema = new Schema<IProgress>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  status: {
    type: String,
    enum: ["not_started", "in_progress", "completed"],
    default: "not_started",
  },
  score: Number,
  timeSpent: { type: Number, default: 0 },
  xpEarned: Number,
  attempts: { type: Number, default: 0 },
  completedAt: Date,
});

ProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const Progress: Model<IProgress> =
  mongoose.models.Progress || mongoose.model<IProgress>("Progress", ProgressSchema);
