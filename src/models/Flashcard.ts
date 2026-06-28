import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IFlashcard extends Document {
  moduleId: Types.ObjectId;
  front: string;
  back: string;
  hint?: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  order: number;
}

const FlashcardSchema = new Schema<IFlashcard>({
  moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true },
  front: String,
  back: String,
  hint: String,
  difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  tags: [String],
  order: Number,
});

export const Flashcard: Model<IFlashcard> =
  mongoose.models.Flashcard || mongoose.model<IFlashcard>("Flashcard", FlashcardSchema);
