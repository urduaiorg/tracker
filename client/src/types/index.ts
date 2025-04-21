import { 
  PlatformType, 
  Analytics, 
  BrandSettings, 
  ProcessingFile, 
  FileProcessingStatus, 
  FileType,
  ExportFormat,
  TemplateStyle,
  ExportOptions
} from "@shared/schema";

// Re-export types from schema
export type {
  PlatformType,
  Analytics,
  BrandSettings,
  ProcessingFile,
  FileProcessingStatus,
  FileType,
  ExportFormat,
  TemplateStyle,
  ExportOptions
};

// Additional frontend-specific types
export interface MetricData {
  platform: PlatformType;
  metricName: string;
  metricValue: string | number;
  period?: string;
  confidence?: number;
}

export interface PlatformData {
  platform: PlatformType;
  handle?: string;
  metrics: Record<string, string | number>;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
    fill?: boolean;
  }[];
}

export interface FileReaderResult {
  success: boolean;
  data?: Analytics[];
  error?: string;
}

export interface OcrResult {
  text: string;
  metrics?: MetricData[];
  confidence?: number;
}

export interface FileWithPreview extends File {
  preview?: string;
}
