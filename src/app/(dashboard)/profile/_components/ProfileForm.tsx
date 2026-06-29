"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/features/dashboard/actions";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional().or(z.literal("")),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm({ user }: { user: any }) {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
      bio: user?.bio || "",
      github: user?.socialLinks?.github || "",
      linkedin: user?.socialLinks?.linkedin || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsPending(true);
    try {
      await updateProfile(data);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">First Name</label>
          <Input 
            {...form.register("firstName")} 
            className="bg-white/5 border-border focus-visible:ring-cyan-500" 
          />
          {form.formState.errors.firstName && (
            <p className="text-red-400 text-xs mt-1">{form.formState.errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Last Name</label>
          <Input 
            {...form.register("lastName")} 
            className="bg-white/5 border-border focus-visible:ring-cyan-500" 
          />
          {form.formState.errors.lastName && (
            <p className="text-red-400 text-xs mt-1">{form.formState.errors.lastName.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Username</label>
        <Input 
          {...form.register("username")} 
          placeholder="e.g. data_wizard_99" 
          className="bg-white/5 border-border focus-visible:ring-cyan-500" 
        />
        {form.formState.errors.username && (
          <p className="text-red-400 text-xs mt-1">{form.formState.errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Bio</label>
        <Textarea 
          {...form.register("bio")} 
          placeholder="Tell us about your data engineering journey..." 
          className="bg-white/5 border-border focus-visible:ring-cyan-500 h-32 resize-none"
        />
        {form.formState.errors.bio && (
          <p className="text-red-400 text-xs mt-1">{form.formState.errors.bio.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">GitHub Profile URL</label>
          <Input 
            {...form.register("github")} 
            placeholder="https://github.com/yourusername" 
            className="bg-white/5 border-border focus-visible:ring-cyan-500" 
          />
          {form.formState.errors.github && (
            <p className="text-red-400 text-xs mt-1">{form.formState.errors.github.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">LinkedIn Profile URL</label>
          <Input 
            {...form.register("linkedin")} 
            placeholder="https://linkedin.com/in/yourusername" 
            className="bg-white/5 border-border focus-visible:ring-cyan-500" 
          />
          {form.formState.errors.linkedin && (
            <p className="text-red-400 text-xs mt-1">{form.formState.errors.linkedin.message}</p>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-border">
        <Button 
          type="submit" 
          disabled={isPending}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold min-w-[150px] mt-4"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
