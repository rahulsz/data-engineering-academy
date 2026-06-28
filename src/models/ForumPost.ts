import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IForumPost extends Document {
  userId: Types.ObjectId;
  title: string;
  body: string;
  tags: string[];
  views: number;
  likes: Types.ObjectId[];
  answers: {
    userId: Types.ObjectId;
    body: string;
    accepted: boolean;
    likes: Types.ObjectId[];
    createdAt: Date;
  }[];
  solved: boolean;
  pinned: boolean;
  moduleId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ForumPostSchema = new Schema<IForumPost>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    body: String,
    tags: [String],
    views: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    answers: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        body: String,
        accepted: { type: Boolean, default: false },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    solved: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    moduleId: { type: Schema.Types.ObjectId, ref: "Module" },
  },
  { timestamps: true }
);

ForumPostSchema.index({ title: "text", body: "text" });

export const ForumPost: Model<IForumPost> =
  mongoose.models.ForumPost || mongoose.model<IForumPost>("ForumPost", ForumPostSchema);
