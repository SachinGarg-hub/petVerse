import { ErrorBoundary } from 'react-error-boundary';
import { MdErrorOutline } from 'react-icons/md';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="p-8 text-center flex flex-col items-center justify-center glass rounded-3xl border border-red-100 dark:border-red-900/30">
      <MdErrorOutline className="text-red-500 mb-4" size={48} />
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Something went wrong</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-md">
        {error.message || "We encountered an error while loading this section."}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-2 bg-petverse-purple text-white rounded-full font-bold hover:opacity-90 transition-all"
      >
        Try again
      </button>
    </div>
  );
};

const ErrorBoundaryWrapper = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
