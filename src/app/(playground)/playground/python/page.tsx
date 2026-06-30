import { PythonPlaygroundWrapper } from '@/features/playground/python/PythonPlaygroundWrapper';

export const metadata = {
  title: 'Python Playground — DataEngineering.Academy',
  description: 'Interactive Python Playground powered by Pyodide.',
};

export default function PythonPlaygroundPage() {
  return (
    <div className="h-[calc(100vh-56px)]">
      <PythonPlaygroundWrapper />
    </div>
  );
}
