import React from "react";
import { formatFileSize } from "@/lib/fileUtils";
import { FileProcessingStatus, FileType, ProcessingFile } from "@/types";
import { CheckIcon, FileIcon, FileImageIcon, FileSpreadsheetIcon, File, XIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ProgressCardProps {
  file: ProcessingFile;
  onView?: () => void;
  onCancel?: () => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ file, onView, onCancel }) => {
  const getStatusColor = (status: FileProcessingStatus) => {
    switch (status) {
      case "completed":
        return "text-green-500 bg-green-50";
      case "error":
        return "text-red-500 bg-red-50";
      case "processing":
        return "text-primary bg-blue-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case "image":
        return <FileImageIcon className="text-xl" />;
      case "pdf":
        return <File className="text-xl" />;
      case "spreadsheet":
        return <FileSpreadsheetIcon className="text-xl" />;
      default:
        return <FileIcon className="text-xl" />;
    }
  };

  const getStatusText = (status: FileProcessingStatus) => {
    switch (status) {
      case "completed":
        return "Complete";
      case "error":
        return file.error || "Error processing file";
      case "processing":
        return file.progress < 50 ? "Reading file..." : "Extracting metrics...";
      default:
        return "Waiting...";
    }
  };

  const getStatusIcon = (status: FileProcessingStatus) => {
    switch (status) {
      case "completed":
        return <CheckIcon className="text-xl" />;
      case "error":
        return <XIcon className="text-xl" />;
      default:
        return getFileIcon(file.type);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(file.status)}`}>
          {getStatusIcon(file.status)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className="font-medium">{file.name}</h4>
            <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
          </div>
          <div className="mt-2 mb-1">
            <Progress 
              value={file.status === "completed" ? 100 : file.progress} 
              className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs ${file.status === "error" ? "text-red-600" : "text-gray-600"}`}>
              {getStatusText(file.status)}
            </span>
            {file.status === "completed" && onView && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={onView} 
                className="text-xs text-primary font-medium p-0 h-auto"
              >
                View
              </Button>
            )}
            {file.status === "processing" && onCancel && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={onCancel} 
                className="text-xs text-red-500 font-medium p-0 h-auto"
              >
                Cancel
              </Button>
            )}
            {file.status === "error" && onCancel && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={onCancel} 
                className="text-xs text-gray-500 font-medium p-0 h-auto"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
