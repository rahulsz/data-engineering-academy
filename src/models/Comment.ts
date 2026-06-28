import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IComment extends Document {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  likes: Types.ObjectId[];
  parentId?: Types.ObjectId;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "BlogPost", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: String,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    parentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    edited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
