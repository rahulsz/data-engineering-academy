import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Minimal Header */}
      <header className="w-full flex items-center justify-between p-6 md:px-10 md:py-8 relative z-10">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Academy
        </Link>
        <div className="flex items-center gap-2 opacity-80">
          <Zap className="h-5 w-5 text-primary" fill="currentColor" />
          <span className="font-bold tracking-tight">DE.Academy</span>
        </div>
      </header>

      {/* Auth Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 pb-20">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-sm tracking-tight">Log in to continue your learning journey.</p>
        </div>
        
        <div className="w-full max-w-[400px]">
          <SignIn 
            appearance={{
              elements: {
                card: "bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 m-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-white/10 bg-white/5 hover:bg-white/10 text-foreground transition-colors",
                socialButtonsBlockButtonText: "font-medium text-[13px]",
                dividerLine: "bg-white/10",
                dividerText: "text-muted-foreground text-xs",
                formFieldLabel: "text-muted-foreground text-xs font-medium",
                formFieldInput: "bg-white/5 border-white/10 text-foreground focus:ring-primary/50 focus:border-primary/50",
                formButtonPrimary: "bg-foreground text-background hover:bg-foreground/90 font-medium text-sm transition-colors",
                footerActionText: "text-muted-foreground text-[13px]",
                footerActionLink: "text-primary hover:text-primary/80 font-medium",
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}
