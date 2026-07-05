import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center py-10 text-center">
      <div className="clean-card max-w-xl p-10">
        <p className="text-7xl font-black text-gradient">404</p>
        <h1 className="mt-4 text-3xl font-black">Page not found</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">The page you opened does not exist.</p>
        <Link to="/" className="btn-primary mt-8 inline-flex">Go Home</Link>
      </div>
    </div>
  );
}
