import React from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="mx-auto max-w-lg rounded-3xl border border-rose-500/30 bg-rose-950/25 p-8 text-center shadow-card ring-1 ring-white/5"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-2xl">
            ⚠️
          </div>
          <h2 className="text-lg font-bold text-white">Something went wrong</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Try refreshing the page. If the problem persists, come back later.
          </p>
          <p className="mt-4 text-xs font-mono text-slate-600">ErrorBoundary</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
