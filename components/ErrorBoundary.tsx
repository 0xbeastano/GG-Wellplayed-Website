import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gg-dark flex flex-col items-center justify-center p-4 text-center font-mono">
          <div className="bg-gg-medium border border-red-500/50 p-8 rounded-2xl max-w-md w-full shadow-[0_0_30px_rgba(255,0,0,0.2)]">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-500/10 rounded-full text-red-500 animate-pulse">
                <AlertTriangle size={48} />
              </div>
            </div>
            
            <h1 className="text-2xl font-heading font-bold text-white mb-2">SYSTEM CRITICAL FAILURE</h1>
            <p className="text-gray-400 mb-6 text-sm">
              An unexpected error occurred in the neural network. We've logged this anomaly for investigation.
            </p>
            
            <div className="bg-black/50 p-3 rounded border border-gray-800 text-left mb-6 overflow-hidden">
              <code className="text-red-400 text-xs break-all">
                {this.state.error?.message || "Unknown Error"}
              </code>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors group"
            >
              <RefreshCw className="mr-2 group-hover:rotate-180 transition-transform duration-500" size={18} />
              REBOOT SYSTEM
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}