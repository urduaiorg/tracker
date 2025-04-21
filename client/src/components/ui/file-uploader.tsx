import * as React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileWithPreview } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CloudUploadIcon, FileIcon, XIcon } from "lucide-react";
import { createFilePreview, revokeFilePreview } from "@/lib/fileUtils";

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  acceptedFileTypes = ["image/*", "application/pdf", ".csv", ".xlsx", ".xls"],
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
  disabled = false,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: createFilePreview(file),
        })
      );

      setFiles((prev) => [...prev, ...newFiles]);
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const removeFile = useCallback(
    (file: FileWithPreview) => {
      setFiles((prev) => prev.filter((f) => f !== file));
      if (file.preview) {
        revokeFilePreview(file.preview);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles,
    maxSize,
    disabled,
  });

  // Clean up previews when component unmounts
  React.useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          revokeFilePreview(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer hover:border-primary",
          isDragActive && "border-primary bg-blue-50",
          isDragReject && "border-red-500 bg-red-50",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="mx-auto max-w-md">
          <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <CloudUploadIcon className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-heading font-semibold mb-2">
            {isDragActive
              ? "Drop your files here"
              : "Drop your files here"}
          </h3>
          <p className="text-gray-600 mb-4">
            Upload screenshots, PDFs, or spreadsheets to extract analytics
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              PNG/JPG
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              PDF
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              Excel
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              CSV
            </span>
          </div>

          <Button className="bg-primary text-white rounded-lg font-medium hover:bg-blue-600 inline-flex items-center gap-2">
            <FileIcon className="w-4 h-4" /> Select Files
          </Button>
          <p className="text-xs text-gray-500 mt-3">
            or forward analytics emails to import@socialkit.app
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Selected Files ({files.length})</h4>
          <ul className="space-y-2">
            {files.map((file) => (
              <li
                key={`${file.name}-${file.lastModified}`}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <div className="flex items-center">
                  <FileIcon className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file)}
                  className="text-gray-500 h-8 w-8 p-0"
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
