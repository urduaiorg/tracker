import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BrandSettings, ExportOptions, TemplateStyle, ExportFormat } from "@/types";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface BrandContextType {
  brandSettings: BrandSettings | null;
  exportOptions: ExportOptions;
  updateBrandSettings: (settings: Partial<BrandSettings>) => Promise<void>;
  updateExportOptions: (options: Partial<ExportOptions>) => void;
  isLoading: boolean;
}

const defaultBrandSettings: BrandSettings = {
  id: 0,
  userId: 1, // Default user ID
  name: "Content Creator",
  handle: "@creator",
  bio: "Content Creator",
  logo: "",
  primaryColor: "#3B82F6",
  secondaryColor: "#10B981",
  accentColor: "#F59E0B",
  language: "en",
  createdAt: new Date(),
};

const defaultExportOptions: ExportOptions = {
  format: "pdf",
  template: "modern",
  includeQrCodes: true,
  includeGrowthTrends: true,
  addWatermark: false,
  includeRawData: false,
};

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [brandSettings, setBrandSettings] = useState<BrandSettings | null>(null);
  const [exportOptions, setExportOptions] = useLocalStorage<ExportOptions>(
    "export-options",
    defaultExportOptions
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBrandSettings = async () => {
      setIsLoading(true);
      try {
        // Assuming user ID 1 for now since we don't have auth
        const userId = 1;
        const response = await fetch(`/api/brand-settings?userId=${userId}`);
        
        if (!response.ok) {
          // If 404, just use default settings
          if (response.status === 404) {
            setBrandSettings(defaultBrandSettings);
            return;
          }
          throw new Error("Failed to fetch brand settings");
        }
        
        const data = await response.json();
        if (Object.keys(data).length === 0) {
          // No settings found, use defaults
          setBrandSettings(defaultBrandSettings);
        } else {
          setBrandSettings(data);
        }
      } catch (error) {
        console.error("Error fetching brand settings:", error);
        setBrandSettings(defaultBrandSettings);
        toast({
          title: "Warning",
          description: "Could not load brand settings. Using defaults.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandSettings();
  }, [toast]);

  const updateBrandSettings = async (settings: Partial<BrandSettings>) => {
    try {
      if (!brandSettings) return;
      
      const updatedSettings = { ...brandSettings, ...settings };
      setIsLoading(true);
      
      const response = await apiRequest("POST", "/api/brand-settings", updatedSettings);
      const savedSettings = await response.json();
      
      setBrandSettings(savedSettings);
      toast({
        title: "Success",
        description: "Brand settings updated successfully",
      });
    } catch (error) {
      console.error("Error updating brand settings:", error);
      toast({
        title: "Error",
        description: "Failed to update brand settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateExportOptions = (options: Partial<ExportOptions>) => {
    setExportOptions((prev) => ({ ...prev, ...options }));
  };

  const value = {
    brandSettings,
    exportOptions,
    updateBrandSettings,
    updateExportOptions,
    isLoading,
  };

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
};
