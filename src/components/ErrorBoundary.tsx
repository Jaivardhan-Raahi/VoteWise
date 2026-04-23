"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4 text-center space-y-4">
          <h2 className="text-3xl font-bold text-zinc-900">Something went wrong</h2>
          <p className="text-zinc-600 max-w-md">
            We've encountered an unexpected error. Please try refreshing the page or navigating back home.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800 transition-colors"
          >
            Return Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
