"use client";

import dynamic from 'next/dynamic';

export const PythonPlaygroundWrapper = dynamic(
  () => import('./PythonPlayground').then(mod => mod.PythonPlayground),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center text-slate-500">Loading Editor...</div> }
);
