import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Analytics, ProcessingFile, FileProcessingStatus } from "@/types";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface AnalyticsContextType {
  analytics: Analytics[];
  processingFiles: ProcessingFile[];
  addProcessingFile: (file: ProcessingFile) => void;
  updateProcessingFile: (id: string, updates: Partial<ProcessingFile>) => void;
  removeProcessingFile: (id: string) => void;
  addAnalytics: (newAnalytics: Analytics) => Promise<void>;
  updateAnalytics: (analytics: Analytics) => Promise<void>;
  deleteAnalytics: (id: number) => Promise<void>;
  clearAllAnalytics: () => void;
  isLoading: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [processingFiles, setProcessingFiles] = useLocalStorage<ProcessingFile[]>(
    "processing-files",
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast({
          title: "Error",
          description: "Failed to load analytics data. Using local data only.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [toast]);

  const addProcessingFile = (file: ProcessingFile) => {
    setProcessingFiles((prev) => [...prev, file]);
  };

  const updateProcessingFile = (id: string, updates: Partial<ProcessingFile>) => {
    setProcessingFiles((prev) =>
      prev.map((file) => (file.id === id ? { ...file, ...updates } : file))
    );
  };

  const removeProcessingFile = (id: string) => {
    setProcessingFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const addAnalytics = async (newAnalytics: Analytics) => {
    try {
      const response = await apiRequest("POST", "/api/analytics", newAnalytics);
      const addedAnalytics = await response.json();
      setAnalytics((prev) => [...prev, addedAnalytics]);
      toast({
        title: "Success",
        description: "Analytics data added successfully",
      });
    } catch (error) {
      console.error("Error adding analytics:", error);
      toast({
        title: "Error",
        description: "Failed to add analytics data",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateAnalytics = async (updatedAnalytics: Analytics) => {
    try {
      await apiRequest("PATCH", `/api/analytics/${updatedAnalytics.id}`, updatedAnalytics);
      setAnalytics((prev) =>
        prev.map((item) => (item.id === updatedAnalytics.id ? updatedAnalytics : item))
      );
      toast({
        title: "Success",
        description: "Analytics data updated successfully",
      });
    } catch (error) {
      console.error("Error updating analytics:", error);
      toast({
        title: "Error",
        description: "Failed to update analytics data",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteAnalytics = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/analytics/${id}`, undefined);
      setAnalytics((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: "Success",
        description: "Analytics data deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting analytics:", error);
      toast({
        title: "Error",
        description: "Failed to delete analytics data",
        variant: "destructive",
      });
      throw error;
    }
  };

  const clearAllAnalytics = () => {
    setAnalytics([]);
    localStorage.removeItem("analytics");
    toast({
      title: "Success",
      description: "All analytics data cleared",
    });
  };

  const value = {
    analytics,
    processingFiles,
    addProcessingFile,
    updateProcessingFile,
    removeProcessingFile,
    addAnalytics,
    updateAnalytics,
    deleteAnalytics,
    clearAllAnalytics,
    isLoading,
  };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};
