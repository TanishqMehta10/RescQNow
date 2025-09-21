import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console for developer debugging
    // In a real app you might send this to an error-tracking service
    // eslint-disable-next-line no-console
    console.error('Uncaught error in component tree:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-6 text-left">
            <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-700 mb-4">An unexpected error occurred while rendering this page.</p>
            <details className="whitespace-pre-wrap text-xs text-gray-600 mb-4">
              {this.state.error?.toString()}
            </details>
            <div className="flex gap-3">
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Reload</button>
              <button onClick={() => this.setState({ hasError: false, error: null })} className="px-4 py-2 border rounded-lg">Dismiss</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
