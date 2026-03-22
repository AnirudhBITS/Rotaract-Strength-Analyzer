import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, fontFamily: 'system-ui' }}>
          <h2 style={{ color: 'red' }}>Something went wrong</h2>
          <pre style={{ background: '#f0f0f0', padding: 10, borderRadius: 8, fontSize: 12, whiteSpace: 'pre-wrap', overflow: 'auto' }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
