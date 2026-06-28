import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAchievement extends Document {
  userId: Types.ObjectId;
  type:
    | "first_lesson"
    | "streak_7"
    | "streak_30"
    | "xp_100"
    | "xp_1000"
    | "sql_master"
    | "python_master"
    | "de_master"
    | "quiz_perfect"
    | "project_complete"
    | "forum_helper";
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: [
      "first_lesson",
      "streak_7",
      "streak_30",
      "xp_100",
      "xp_1000",
      "sql_master",
      "python_master",
      "de_master",
      "quiz_perfect",
      "project_complete",
      "forum_helper",
    ],
    required: true,
  },
  title: String,
  description: String,
  icon: String,
  xpReward: Number,
  unlockedAt: { type: Date, default: Date.now },
});

export const Achievement: Model<IAchievement> =
  mongoose.models.Achievement || mongoose.model<IAchievement>("Achievement", AchievementSchema);
