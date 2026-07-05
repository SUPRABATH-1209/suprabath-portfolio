import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({ title, message, action = true }: { title: string; message: string; action?: boolean }) {
  return (
    <div className="clean-card flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 rounded-3xl bg-amber-50 p-4 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300">
        <PlusCircle size={34} />
      </div>
      <h2 className="text-2xl font-black text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-300">{message}</p>
      {action && (
        <Link to="/admin" className="btn-primary mt-7 inline-flex items-center gap-2">
          Add real content
        </Link>
      )}
    </div>
  );
}
