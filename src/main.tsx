
import React from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import App from './App.tsx'
import './index.css'

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
        <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {error.message}
        </pre>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload page
        </button>
      </div>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
