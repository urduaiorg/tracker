import React from "react";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { ProgressCard } from "@/components/ui/progress-card";
import { useToast } from "@/hooks/use-toast";

interface ProcessingAreaProps {
  className?: string;
}

export const ProcessingArea: React.FC<ProcessingAreaProps> = ({ className }) => {
  const { processingFiles, updateProcessingFile, removeProcessingFile } = useAnalytics();
  const { toast } = useToast();

  const handleView = (fileId: string) => {
    // In a real app, this would potentially show a modal with the extracted data
    // For now, just show a toast message
    toast({
      title: "Viewing File Data",
      description: "The extracted data has been added to the review grid below.",
    });
  };

  const handleCancel = (fileId: string) => {
    // This would cancel processing in a real app
    // For now, just remove the file from the list
    removeProcessingFile(fileId);
    toast({
      title: "Processing Cancelled",
      description: "File processing has been cancelled.",
    });
  };

  // If there are no processing files, don't render the component
  if (processingFiles.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="text-xl font-heading font-semibold mb-4">Processing Files</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {processingFiles.map((file) => (
          <ProgressCard
            key={file.id}
            file={file}
            onView={file.status === "completed" ? () => handleView(file.id) : undefined}
            onCancel={() => handleCancel(file.id)}
          />
        ))}
      </div>
    </div>
  );
};
