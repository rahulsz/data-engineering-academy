import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
  slug: string;
  title: string;
  description: string;
  icon: string;
  coverImage: string;
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  order: number;
  estimatedHours: number;
  totalLessons: number;
  published: boolean;
  featured: boolean;
}

const CourseSchema = new Schema<ICourse>({
  slug: { type: String, required: true, unique: true },
  title: String,
  description: String,
  icon: String,
  coverImage: String,
  level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  tags: [String],
  order: Number,
  estimatedHours: Number,
  totalLessons: Number,
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
});

export const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
