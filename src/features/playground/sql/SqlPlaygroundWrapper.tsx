"use client";

import dynamic from 'next/dynamic';

export const SqlPlaygroundWrapper = dynamic(
  () => import('./SqlPlayground').then(mod => mod.SqlPlayground),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center text-slate-500">Loading Editor...</div> }
);
