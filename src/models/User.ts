import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: "student" | "admin";
  xp: number;
  level: number;
  streak: number;
  lastActive?: Date;
  longestStreak: number;
  bio?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  preferences?: {
    emailNotifications: boolean;
    theme: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true, sparse: true },
    firstName: String,
    lastName: String,
    avatar: String,
    role: { type: String, enum: ["student", "admin"], default: "student" },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastActive: Date,
    longestStreak: { type: Number, default: 0 },
    bio: String,
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      theme: { type: String, default: "dark" },
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
