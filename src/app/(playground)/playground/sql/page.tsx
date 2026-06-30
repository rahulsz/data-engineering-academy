import { SqlPlaygroundWrapper } from '@/features/playground/sql/SqlPlaygroundWrapper';

export const metadata = {
  title: 'SQL Playground — DataEngineering.Academy',
  description: 'Interactive SQL Playground with multiple databases.',
};

export default function SqlPlaygroundPage() {
  return (
    <div className="h-[calc(100vh-56px)]">
      <SqlPlaygroundWrapper />
    </div>
  );
}
