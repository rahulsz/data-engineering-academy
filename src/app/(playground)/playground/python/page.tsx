import { PythonPlayground } from '@/features/playground/python/PythonPlayground';

export const metadata = {
  title: 'Python Playground — DataEngineering.Academy',
  description: 'Interactive Python Playground powered by Pyodide.',
};

export default function PythonPlaygroundPage() {
  return (
    <div className="h-[calc(100vh-56px)]">
      <PythonPlayground />
    </div>
  );
}
