import React, { ErrorInfo, ReactNode } from 'react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Pulse UI error', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-error" role="alert">
          <span>PULSE</span>
          <h1>Something went wrong</h1>
          <p>Your local data is safe. Reload the page to restore this view.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload Pulse
          </button>
          <a href="/">Back to the site</a>
        </main>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
