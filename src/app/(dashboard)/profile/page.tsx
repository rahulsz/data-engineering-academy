import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function ProfilePage() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  await connectDB();
  const dbUser = await User.findOne({ clerkId: clerkUser.id });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Your Profile</h1>
        <p className="text-slate-400">Manage your public profile and preferences.</p>
      </div>

      <div className="bg-black/40 border border-surface-deep/50 rounded-xl p-8 backdrop-blur-md">
        <div className="flex items-center gap-6 mb-8">
          <img 
            src={clerkUser.imageUrl} 
            alt="Profile" 
            className="w-24 h-24 rounded-full border-4 border-indigo-500/20"
          />
          <div>
            <h2 className="text-xl font-bold text-white">{dbUser?.firstName} {dbUser?.lastName}</h2>
            <p className="text-slate-400">{dbUser?.email}</p>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">First Name</label>
              <Input defaultValue={dbUser?.firstName || ""} className="bg-surface-deep/30 border-surface-deep" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Last Name</label>
              <Input defaultValue={dbUser?.lastName || ""} className="bg-surface-deep/30 border-surface-deep" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Username</label>
            <Input defaultValue={dbUser?.username || ""} placeholder="@username" className="bg-surface-deep/30 border-surface-deep" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Bio</label>
            <Textarea 
              defaultValue={dbUser?.bio || ""} 
              placeholder="Tell us about your data engineering journey..." 
              className="bg-surface-deep/30 border-surface-deep h-32"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="button" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
