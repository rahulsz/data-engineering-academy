import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ILesson extends Document {
  moduleId: Types.ObjectId;
  courseId: Types.ObjectId;
  slug: string;
  title: string;
  type: "theory" | "interactive" | "quiz" | "project" | "exercise" | "video";
  content: string;
  xpReward: number;
  order: number;
  duration: number;
  hasVisualizer: boolean;
  hasPlayground: boolean;
  published: boolean;
}

const LessonSchema = new Schema<ILesson>({
  moduleId: { type: Schema.Types.ObjectId, ref: "Module" },
  courseId: { type: Schema.Types.ObjectId, ref: "Course" },
  slug: String,
  title: String,
  type: {
    type: String,
    enum: ["theory", "interactive", "quiz", "project", "exercise", "video"],
  },
  content: String,
  xpReward: { type: Number, default: 10 },
  order: Number,
  duration: Number, // minutes
  hasVisualizer: { type: Boolean, default: false },
  hasPlayground: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
});

export const Lesson: Model<ILesson> =
  mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema);
