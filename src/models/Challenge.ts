import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChallenge extends Document {
  title: string;
  description: string;
  type: "sql" | "python" | "de_concept";
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  starterCode?: string;
  solution?: string;
  testCases: { input: string; expected: string; hidden: boolean }[];
  hints: string[];
  xpReward: number;
  tags: string[];
  order: number;
}

const ChallengeSchema = new Schema<IChallenge>({
  title: String,
  description: String,
  type: { type: String, enum: ["sql", "python", "de_concept"] },
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  category: String,
  starterCode: String,
  solution: String,
  testCases: [
    {
      input: String,
      expected: String,
      hidden: { type: Boolean, default: false },
    },
  ],
  hints: [String],
  xpReward: Number,
  tags: [String],
  order: Number,
});

export const Challenge: Model<IChallenge> =
  mongoose.models.Challenge || mongoose.model<IChallenge>("Challenge", ChallengeSchema);
