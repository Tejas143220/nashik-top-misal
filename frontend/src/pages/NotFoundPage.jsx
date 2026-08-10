import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/seo/SEOHead';
import { Flame, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <>
      <SEOHead title="404 Page Not Found - Nashik's Best Misal" />
      <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-brand-100 text-brand-600 flex items-center justify-center">
          <Flame className="w-8 h-8 fill-brand-500" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">404 - Page Not Found</h1>
        <p className="text-xs text-slate-500 max-w-sm">
          Oops! The page or misal shop route you were looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
        >
          <Home className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
