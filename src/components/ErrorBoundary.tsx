import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

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
    const props = (this as any).props;
    if (this.state.hasError) {
      return props.fallback || (
        <div className="p-10 text-center text-red-500">
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.message}</pre>
        </div>
      );
    }

    return props.children;
  }
}
