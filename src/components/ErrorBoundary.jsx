import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: "2rem",
            maxWidth: 560,
            margin: "4rem auto",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Something went wrong</h1>
          <p style={{ color: "#64748b", marginBottom: "1rem" }}>
            The page failed to load. Try a hard refresh (Ctrl+Shift+R) or run{" "}
            <code>npm run production</code> again.
          </p>
          <pre
            style={{
              fontSize: "0.8rem",
              background: "#f1f5f9",
              padding: "1rem",
              borderRadius: 8,
              overflow: "auto",
            }}
          >
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
