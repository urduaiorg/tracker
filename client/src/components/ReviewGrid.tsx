import React, { useState } from "react";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { Analytics } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ReviewGridProps {
  className?: string;
}

export const ReviewGrid: React.FC<ReviewGridProps> = ({ className }) => {
  const { analytics, updateAnalytics } = useAnalytics();
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Combine data from both analytics and completed processing files
  const completedFileData = (analytics || []).filter(
    (item) => item.platform && item.metricName && item.metricValue
  );

  // If there's no data, don't render the component
  if (completedFileData.length === 0) {
    return null;
  }

  const handleEdit = (item: Analytics) => {
    setEditingRow(item.id);
    setEditValue(item.metricValue);
  };

  const handleSave = async (item: Analytics) => {
    try {
      // In a real app, this would call updateAnalytics
      // await updateAnalytics({ ...item, metricValue: editValue });
      setEditingRow(null);
    } catch (error) {
      console.error("Error updating analytics:", error);
    }
  };

  const getConfidenceBadge = (confidence?: number) => {
    if (!confidence) return null;
    
    let variant = "default";
    if (confidence >= 90) {
      variant = "success";
    } else if (confidence >= 70) {
      variant = "warning";
    } else {
      variant = "destructive";
    }
    
    return (
      <Badge variant={variant as any} className="rounded-full">
        {confidence}%
      </Badge>
    );
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-heading font-semibold">Review Extracted Data</h3>
        <Button variant="ghost" size="sm" className="text-primary text-sm font-medium flex items-center gap-1">
          <Pencil className="h-4 w-4" /> Edit All
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Value</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Period</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedFileData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <PlatformIcon platform={item.platform as any} size="sm" />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.metricName}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {editingRow === item.id ? (
                      <Input
                        className="text-sm font-medium text-gray-900 w-32"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave(item);
                          if (e.key === "Escape") setEditingRow(null);
                        }}
                        autoFocus
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{item.metricValue}</div>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.period || "N/A"}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {getConfidenceBadge(item.confidence)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-gray-500">
                    {editingRow === item.id ? (
                      <Button variant="link" size="sm" onClick={() => handleSave(item)} className="p-0 h-auto">
                        Save
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="text-primary hover:text-blue-700 p-1 h-auto">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
