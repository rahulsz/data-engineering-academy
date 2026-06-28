import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "./db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    return null;
  }

  await connectDB();
  
  const dbUser = await User.findOne({ clerkId: clerkUser.id });
  return dbUser;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }
  return true;
}
