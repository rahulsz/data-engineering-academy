import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  slug: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  stack: string[];
  coverImage: string;
  overview: string;
  architecture: string;
  folderStructure: string;
  implementationGuide: string;
  learningOutcomes: string[];
  prerequisites: string[];
  estimatedHours: number;
  githubUrl?: string;
  featured: boolean;
}

const ProjectSchema = new Schema<IProject>({
  slug: { type: String, required: true, unique: true },
  title: String,
  description: String,
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  stack: [String],
  coverImage: String,
  overview: String,
  architecture: String,
  folderStructure: String,
  implementationGuide: String,
  learningOutcomes: [String],
  prerequisites: [String],
  estimatedHours: Number,
  githubUrl: String,
  featured: { type: Boolean, default: false },
});

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
