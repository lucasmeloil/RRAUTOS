import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: '#0F172A',
          color: '#F8FAFF',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8, color: '#FFFFFF' }}>
            Ops! Algo deu errado ao carregar o portal.
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: 600, marginBottom: 24, fontSize: '0.95rem', lineHeight: 1.6 }}>
            {this.state.error?.message || 'Ocorreu um erro inesperado.'}
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                background: '#4A7DFF',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Recarregar Página
            </button>
            <button
              onClick={() => { localStorage.clear(); window.location.href = '/' }}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Limpar Cache e Ir para Home
            </button>
          </div>
          {this.state.errorInfo && (
            <details style={{ marginTop: 24, textAlign: 'left', maxWidth: 800, width: '100%', background: '#1E293B', padding: 16, borderRadius: 8, color: '#EF4444', fontSize: '0.8rem', overflowX: 'auto' }}>
              <summary style={{ cursor: 'pointer', color: '#CBD5E1', marginBottom: 8 }}>Detalhes técnicos do erro</summary>
              <pre>{this.state.error?.stack}</pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
