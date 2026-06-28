import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IModule extends Document {
  courseId: Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  order: number;
  icon: string;
  totalLessons: number;
  estimatedMinutes: number;
  published: boolean;
}

const ModuleSchema = new Schema<IModule>({
  courseId: { type: Schema.Types.ObjectId, ref: "Course" },
  slug: String,
  title: String,
  description: String,
  order: Number,
  icon: String,
  totalLessons: Number,
  estimatedMinutes: Number,
  published: { type: Boolean, default: false },
});

export const Module: Model<IModule> =
  mongoose.models.Module || mongoose.model<IModule>("Module", ModuleSchema);
