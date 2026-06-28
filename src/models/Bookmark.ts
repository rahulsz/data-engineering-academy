import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBookmark extends Document {
  userId: Types.ObjectId;
  resourceId: Types.ObjectId;
  resourceType: "lesson" | "blog_post" | "question" | "project";
  title: string;
  url: string;
}

const BookmarkSchema = new Schema<IBookmark>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  resourceId: { type: Schema.Types.ObjectId, required: true },
  resourceType: {
    type: String,
    enum: ["lesson", "blog_post", "question", "project"],
    required: true,
  },
  title: String,
  url: String,
});

BookmarkSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

export const Bookmark: Model<IBookmark> =
  mongoose.models.Bookmark || mongoose.model<IBookmark>("Bookmark", BookmarkSchema);
