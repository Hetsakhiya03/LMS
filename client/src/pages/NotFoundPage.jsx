import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md space-y-6 glass-panel p-10 rounded-3xl border-slate-800 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold font-outfit text-white">404</h1>
          <h2 className="text-xl font-bold font-outfit text-slate-200">Page Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The page or course material you are looking for might have been moved, archived, or does not exist.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/">
            <Button variant="gradient" size="md" icon={Home}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
