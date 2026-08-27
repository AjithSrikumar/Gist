"use client";

import React from "react";
import { useStore } from "@/lib/store";

interface Props {
  children: React.ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.label ? ` — ${this.props.label}` : ""}]`, error.message, error.stack, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg-cream p-6 text-center">
          <p className="text-[17px] font-bold text-ink-900">Something went wrong</p>
          <p className="mt-2 max-w-[320px] text-[13px] text-ink-600">
            {this.state.error?.message ?? "Unknown error"}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              useStore.getState().openReader(null);
              useStore.getState().openBookDetail(null);
            }}
            className="mt-6 h-10 rounded-button bg-brand-blue px-6 text-[14px] font-semibold text-white"
          >
            Go back
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
