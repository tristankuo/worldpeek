import { Component, ErrorInfo, ReactNode } from 'react';

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
    console.error('Uncaught error:', error, errorInfo);

    // Auto-retry logic for smooth user experience
    // Only retry once per session to avoid infinite loops
    const hasRetried = sessionStorage.getItem('app_crashed_retry');
    if (!hasRetried) {
      console.log('🔄 Auto-reloading page to recover from error...');
      sessionStorage.setItem('app_crashed_retry', 'true');
      // Small delay to ensure the error is logged/processed if needed
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          fontFamily: 'system-ui, sans-serif',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f8f9fa'
        }}>
          <h1 style={{ color: '#e53e3e' }}>Something went wrong</h1>
          <p style={{ color: '#4a5568', maxWidth: '500px', margin: '20px 0' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              background: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
