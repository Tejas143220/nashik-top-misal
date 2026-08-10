import React from 'react';
import { Flame, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-2xl animate-bounce">
            <Flame className="w-8 h-8 fill-amber-200" />
          </div>

          <div className="max-w-md space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-amber-300">
              Nashik's Best Misal
            </h1>
            <p className="text-sm text-slate-300">
              Something went wrong while loading this page. Don't worry, your data is safe!
            </p>
          </div>

          <button
            onClick={this.handleReload}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs rounded-2xl shadow-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Reload Page & Continue
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
