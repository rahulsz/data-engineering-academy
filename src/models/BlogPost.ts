import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBlogPost extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: Types.ObjectId;
  coverImage: string;
  tags: string[];
  category: string;
  published: boolean;
  featured: boolean;
  readingTime: number;
  views: number;
  likes: Types.ObjectId[];
  publishedAt?: Date;
}

const BlogPostSchema = new Schema<IBlogPost>({
  slug: { type: String, required: true, unique: true },
  title: String,
  excerpt: String,
  content: String,
  authorId: { type: Schema.Types.ObjectId, ref: "User" },
  coverImage: String,
  tags: [String],
  category: String,
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  readingTime: Number, // minutes
  views: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  publishedAt: Date,
});

BlogPostSchema.index({ title: "text", excerpt: "text", content: "text" });

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
