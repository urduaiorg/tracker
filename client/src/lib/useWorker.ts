import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Custom hook to manage Web Worker execution
 */
export const useWorker = <TData, TResult>(
  worker: new () => Worker,
  onMessage?: (result: TResult) => void,
  onError?: (error: Error) => void
) => {
  const workerRef = useRef<Worker | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Initialize the worker
    const workerInstance = new worker();
    workerRef.current = workerInstance;

    // Set up the message handler
    workerInstance.onmessage = (e) => {
      // Check if it's a progress update
      if (e.data.status === "progress") {
        setProgress(e.data.progress);
        return;
      }

      // Handle completion
      if (e.data.status === "complete") {
        setIsProcessing(false);
        if (onMessage) {
          onMessage(e.data.result);
        }
      }
    };

    // Set up the error handler
    workerInstance.onerror = (e) => {
      setIsProcessing(false);
      const error = new Error(`Worker error: ${e.message}`);
      setError(error);
      if (onError) {
        onError(error);
      }
    };

    // Clean up
    return () => {
      workerInstance.terminate();
      workerRef.current = null;
    };
  }, [worker, onMessage, onError]);

  // Function to post a message to the worker
  const postMessage = useCallback(
    (data: TData) => {
      if (workerRef.current) {
        setIsProcessing(true);
        setError(null);
        setProgress(0);
        workerRef.current.postMessage(data);
      } else {
        const error = new Error("Worker not initialized");
        setError(error);
        if (onError) {
          onError(error);
        }
      }
    },
    [onError]
  );

  return {
    postMessage,
    isProcessing,
    error,
    progress,
    terminate: useCallback(() => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
        setIsProcessing(false);
      }
    }, []),
  };
};
