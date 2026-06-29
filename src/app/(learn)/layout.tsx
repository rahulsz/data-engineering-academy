import React from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-56px)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
