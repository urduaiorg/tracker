import { FileType, FileReaderResult, MetricData, OcrResult, ProcessingFile } from "@/types";
import { cleanOcrText, extractMetrics } from "./ocrUtils";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";

/**
 * Determine file type from File object
 */
export const getFileType = (file: File): FileType => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  
  if (!extension) return "unknown";
  
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(extension)) {
    return "image";
  }
  
  if (extension === "pdf") {
    return "pdf";
  }
  
  if (["xlsx", "xls", "csv", "ods"].includes(extension)) {
    return "spreadsheet";
  }
  
  return "unknown";
};

/**
 * Create a file object URL for preview
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Create a ProcessingFile object from a File
 */
export const createProcessingFile = (file: File): ProcessingFile => {
  return {
    id: uuidv4(),
    name: file.name,
    size: file.size,
    type: getFileType(file),
    status: "pending",
    progress: 0,
  };
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

/**
 * Read a spreadsheet file and extract data
 */
export const readSpreadsheetFile = (file: File): Promise<FileReaderResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          return resolve({ success: false, error: "No data in file" });
        }
        
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // TODO: Parse the JSON data into Analytics objects
        
        resolve({ success: true, data: [] });
      } catch (error) {
        console.error("Error parsing spreadsheet:", error);
        resolve({ 
          success: false, 
          error: error instanceof Error ? error.message : "Unknown error parsing spreadsheet" 
        });
      }
    };
    
    reader.onerror = () => {
      resolve({ success: false, error: "Failed to read file" });
    };
    
    reader.readAsBinaryString(file);
  });
};

/**
 * Release object URLs to prevent memory leaks
 */
export const revokeFilePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Convert image file to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
