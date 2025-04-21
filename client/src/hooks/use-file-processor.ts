import { useState, useCallback } from "react";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { useToast } from "@/hooks/use-toast";
import { useWorker } from "@/lib/useWorker";
import { createProcessingFile, readSpreadsheetFile } from "@/lib/fileUtils";
import { extractMetrics } from "@/lib/ocrUtils";
import { ProcessingFile, OcrResult, Analytics } from "@/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Custom hook to handle file processing tasks
 */
export const useFileProcessor = () => {
  const { toast } = useToast();
  const { addProcessingFile, updateProcessingFile, addAnalytics } = useAnalytics();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Set up Tesseract worker for OCR
  const { postMessage: processImage, progress, isProcessing: isOcrProcessing, terminate } = useWorker<
    { imageData: string; options?: { lang: string } },
    OcrResult
  >(
    // Use dynamic import for the worker
    () => new Worker(new URL("../workers/tesseract.worker.ts", import.meta.url), { type: "module" }),
    (result) => {
      // Process OCR results
      console.log("OCR completed successfully", result);
    },
    (error) => {
      console.error("OCR processing error:", error);
      toast({
        title: "Error",
        description: `OCR processing failed: ${error.message}`,
        variant: "destructive",
      });
    }
  );
  
  // Process image files with OCR
  const processImageFile = useCallback(async (file: File, processingFileId: string) => {
    try {
      // Read the file as data URL
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        if (!imageData) {
          updateProcessingFile(processingFileId, {
            status: "error",
            error: "Failed to read image data",
          });
          return;
        }
        
        try {
          // Update status to processing
          updateProcessingFile(processingFileId, {
            status: "processing",
            progress: 10,
          });
          
          // In a real app, we would process with Tesseract here
          // For demo, simulate OCR processing
          const simulateOcr = async () => {
            for (let i = 10; i <= 90; i += 10) {
              await new Promise(resolve => setTimeout(resolve, 300));
              updateProcessingFile(processingFileId, {
                progress: i,
              });
            }
            
            // Simulate extracted metrics
            const metrics: Analytics[] = [
              {
                id: uuidv4(),
                userId: 1,
                platform: "instagram",
                metricName: "followers",
                metricValue: "89423",
                period: "Apr 2023",
                confidence: 85,
                sourceType: "screenshot",
                createdAt: new Date(),
              }
            ];
            
            updateProcessingFile(processingFileId, {
              status: "completed",
              progress: 100,
              data: metrics,
            });
          };
          
          await simulateOcr();
        } catch (error) {
          console.error("Error processing image:", error);
          updateProcessingFile(processingFileId, {
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error processing image",
          });
        }
      };
      
      reader.onerror = () => {
        updateProcessingFile(processingFileId, {
          status: "error",
          error: "Failed to read file",
        });
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error in processImageFile:", error);
      updateProcessingFile(processingFileId, {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [updateProcessingFile]);
  
  // Process PDF files
  const processPdfFile = useCallback(async (file: File, processingFileId: string) => {
    try {
      // Simulate PDF processing
      updateProcessingFile(processingFileId, {
        status: "processing",
        progress: 10,
      });
      
      const simulateProcessing = async () => {
        for (let i = 10; i <= 90; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 300));
          updateProcessingFile(processingFileId, {
            progress: i,
          });
        }
        
        // Simulate extracted metrics
        const metrics: Analytics[] = [
          {
            id: uuidv4(),
            userId: 1,
            platform: "youtube",
            metricName: "subscribers",
            metricValue: "156240",
            period: "Apr 2023",
            confidence: 95,
            sourceType: "pdf",
            createdAt: new Date(),
          }
        ];
        
        updateProcessingFile(processingFileId, {
          status: "completed",
          progress: 100,
          data: metrics,
        });
      };
      
      await simulateProcessing();
    } catch (error) {
      console.error("Error processing PDF:", error);
      updateProcessingFile(processingFileId, {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error processing PDF",
      });
    }
  }, [updateProcessingFile]);
  
  // Process spreadsheet files
  const processSpreadsheetFile = useCallback(async (file: File, processingFileId: string) => {
    try {
      // Simulate spreadsheet processing
      updateProcessingFile(processingFileId, {
        status: "processing",
        progress: 10,
      });
      
      const simulateProcessing = async () => {
        for (let i = 10; i <= 90; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 300));
          updateProcessingFile(processingFileId, {
            progress: i,
          });
        }
        
        // Simulate extracted metrics
        const metrics: Analytics[] = [
          {
            id: uuidv4(),
            userId: 1,
            platform: "tiktok",
            metricName: "views",
            metricValue: "3542871",
            period: "Mar-Apr 2023",
            confidence: 98,
            sourceType: "spreadsheet",
            createdAt: new Date(),
          }
        ];
        
        updateProcessingFile(processingFileId, {
          status: "completed",
          progress: 100,
          data: metrics,
        });
      };
      
      await simulateProcessing();
    } catch (error) {
      console.error("Error processing spreadsheet:", error);
      updateProcessingFile(processingFileId, {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error processing spreadsheet",
      });
    }
  }, [updateProcessingFile]);
  
  // Main function to process files
  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      for (const file of files) {
        const processingFile = createProcessingFile(file);
        addProcessingFile(processingFile);
        
        // Process based on file type
        switch (processingFile.type) {
          case "image":
            await processImageFile(file, processingFile.id);
            break;
          case "pdf":
            await processPdfFile(file, processingFile.id);
            break;
          case "spreadsheet":
            await processSpreadsheetFile(file, processingFile.id);
            break;
          default:
            updateProcessingFile(processingFile.id, {
              status: "error",
              error: "Unsupported file type",
            });
        }
      }
      
      toast({
        title: "Files Uploaded",
        description: `${files.length} file(s) uploaded and processing started`,
      });
    } catch (error) {
      console.error("Error processing files:", error);
      toast({
        title: "Error",
        description: "Failed to process files",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [
    addProcessingFile, 
    updateProcessingFile, 
    processImageFile, 
    processPdfFile, 
    processSpreadsheetFile, 
    toast
  ]);
  
  // Cancel processing
  const cancelProcessing = useCallback((processingFileId: string) => {
    terminate(); // Stop any running worker
    updateProcessingFile(processingFileId, {
      status: "error",
      error: "Processing cancelled",
    });
  }, [updateProcessingFile, terminate]);
  
  return {
    processFiles,
    cancelProcessing,
    isProcessing,
    ocrProgress: progress,
  };
};
