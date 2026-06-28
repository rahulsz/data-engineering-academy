import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRoadmapNode {
  id: string;
  label: string;
  type: "topic" | "resource" | "milestone";
  position: { x: number; y: number };
  data?: any;
}

export interface IRoadmapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface IRoadmap extends Document {
  slug: string;
  title: string;
  description: string;
  nodes: IRoadmapNode[];
  edges: IRoadmapEdge[];
  published: boolean;
}

const RoadmapSchema = new Schema<IRoadmap>({
  slug: { type: String, required: true, unique: true },
  title: String,
  description: String,
  nodes: [
    {
      id: String,
      label: String,
      type: { type: String, enum: ["topic", "resource", "milestone"] },
      position: {
        x: Number,
        y: Number,
      },
      data: Schema.Types.Mixed,
    },
  ],
  edges: [
    {
      id: String,
      source: String,
      target: String,
      label: String,
    },
  ],
  published: { type: Boolean, default: false },
});

export const Roadmap: Model<IRoadmap> =
  mongoose.models.Roadmap || mongoose.model<IRoadmap>("Roadmap", RoadmapSchema);
