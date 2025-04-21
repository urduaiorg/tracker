import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Eye, FileImage, File, Code } from "lucide-react";
import { useBrand } from "@/contexts/BrandContext";
import { useToast } from "@/hooks/use-toast";
import { exportData, downloadDataUrl, generateFilename } from "@/lib/exportUtils";
import { ExportFormat, TemplateStyle } from "@/types";

interface ExportOptionsProps {
  className?: string;
}

// Sample template images
const templateImages = {
  modern: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  minimal: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  vibrant: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  corporate: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
};

export const ExportOptions: React.FC<ExportOptionsProps> = ({ className }) => {
  const { toast } = useToast();
  const { brandSettings, exportOptions, updateExportOptions } = useBrand();
  const [isExporting, setIsExporting] = useState(false);
  
  const handleFormatChange = (value: ExportFormat) => {
    updateExportOptions({ format: value });
  };
  
  const handleTemplateChange = (value: TemplateStyle) => {
    updateExportOptions({ template: value });
  };
  
  const handleOptionChange = (option: string, checked: boolean) => {
    updateExportOptions({ [option]: checked });
  };
  
  const handleExport = async () => {
    try {
      setIsExporting(true);
      const dataUrl = await exportData("dashboard", exportOptions, brandSettings);
      const filename = generateFilename(exportOptions, brandSettings);
      
      downloadDataUrl(dataUrl, filename);
      
      toast({
        title: "Success!",
        description: "Your media kit has been exported successfully.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export media kit",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handlePreview = () => {
    toast({
      title: "Preview",
      description: "Preview functionality not implemented in demo.",
    });
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-heading font-semibold">Export Options</h3>
      </div>

      <Card className="bg-white shadow-sm border border-gray-100">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Export Format */}
            <div className="col-span-1">
              <h4 className="font-medium mb-3">Export Format</h4>
              <RadioGroup 
                value={exportOptions.format} 
                onValueChange={(value) => handleFormatChange(value as ExportFormat)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="pdf" id="format-pdf" className="h-4 w-4" />
                  <Label htmlFor="format-pdf" className="flex flex-1 items-center justify-between cursor-pointer">
                    <span className="font-medium">PDF Document</span>
                    <File className="text-red-500 h-5 w-5" />
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="jpeg" id="format-jpeg" className="h-4 w-4" />
                  <Label htmlFor="format-jpeg" className="flex flex-1 items-center justify-between cursor-pointer">
                    <span className="font-medium">JPEG Images</span>
                    <FileImage className="text-blue-500 h-5 w-5" />
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="html" id="format-html" className="h-4 w-4" />
                  <Label htmlFor="format-html" className="flex flex-1 items-center justify-between cursor-pointer">
                    <span className="font-medium">Interactive HTML</span>
                    <Code className="text-purple-500 h-5 w-5" />
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Template Style */}
            <div className="col-span-1">
              <h4 className="font-medium mb-3">Template Style</h4>
              <RadioGroup 
                value={exportOptions.template} 
                onValueChange={(value) => handleTemplateChange(value as TemplateStyle)}
                className="grid grid-cols-2 gap-3"
              >
                <div className="space-y-1">
                  <RadioGroupItem value="modern" id="template-modern" className="sr-only peer" />
                  <Label 
                    htmlFor="template-modern" 
                    className="cursor-pointer block"
                  >
                    <div className={`bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] ${exportOptions.template === 'modern' ? 'ring-2 ring-primary' : ''}`}>
                      <img 
                        src={templateImages.modern} 
                        alt="Modern template design" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <p className="text-sm font-medium mt-1 text-center">Modern</p>
                  </Label>
                </div>
                
                <div className="space-y-1">
                  <RadioGroupItem value="minimal" id="template-minimal" className="sr-only peer" />
                  <Label 
                    htmlFor="template-minimal" 
                    className="cursor-pointer block"
                  >
                    <div className={`bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] ${exportOptions.template === 'minimal' ? 'ring-2 ring-primary' : ''}`}>
                      <img 
                        src={templateImages.minimal}
                        alt="Minimal template design" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <p className="text-sm font-medium mt-1 text-center">Minimal</p>
                  </Label>
                </div>
                
                <div className="space-y-1">
                  <RadioGroupItem value="vibrant" id="template-vibrant" className="sr-only peer" />
                  <Label 
                    htmlFor="template-vibrant" 
                    className="cursor-pointer block"
                  >
                    <div className={`bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] ${exportOptions.template === 'vibrant' ? 'ring-2 ring-primary' : ''}`}>
                      <img 
                        src={templateImages.vibrant}
                        alt="Vibrant template design" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <p className="text-sm font-medium mt-1 text-center">Vibrant</p>
                  </Label>
                </div>
                
                <div className="space-y-1">
                  <RadioGroupItem value="corporate" id="template-corporate" className="sr-only peer" />
                  <Label 
                    htmlFor="template-corporate" 
                    className="cursor-pointer block"
                  >
                    <div className={`bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] ${exportOptions.template === 'corporate' ? 'ring-2 ring-primary' : ''}`}>
                      <img 
                        src={templateImages.corporate}
                        alt="Corporate template design" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <p className="text-sm font-medium mt-1 text-center">Corporate</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Additional Options */}
            <div className="col-span-1">
              <h4 className="font-medium mb-3">Additional Options</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Checkbox 
                    id="include-qr" 
                    checked={exportOptions.includeQrCodes}
                    onCheckedChange={(checked) => handleOptionChange('includeQrCodes', checked as boolean)}
                  />
                  <Label htmlFor="include-qr" className="font-medium cursor-pointer">Include QR Codes</Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Checkbox 
                    id="include-trends" 
                    checked={exportOptions.includeGrowthTrends}
                    onCheckedChange={(checked) => handleOptionChange('includeGrowthTrends', checked as boolean)}
                  />
                  <Label htmlFor="include-trends" className="font-medium cursor-pointer">Include Growth Trends</Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Checkbox 
                    id="add-watermark" 
                    checked={exportOptions.addWatermark}
                    onCheckedChange={(checked) => handleOptionChange('addWatermark', checked as boolean)}
                  />
                  <Label htmlFor="add-watermark" className="font-medium cursor-pointer">Add Watermark</Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Checkbox 
                    id="include-raw" 
                    checked={exportOptions.includeRawData}
                    onCheckedChange={(checked) => handleOptionChange('includeRawData', checked as boolean)}
                  />
                  <Label htmlFor="include-raw" className="font-medium cursor-pointer">Include Raw Data Table</Label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto">
              <p className="text-sm text-gray-600 mb-1">Export Preview</p>
              <div className="bg-gray-100 rounded-lg w-full sm:w-40 h-24 flex items-center justify-center text-gray-400">
                <FileImage className="h-10 w-10" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={handlePreview}>
                Preview
              </Button>
              <Button 
                className="bg-primary text-white hover:bg-blue-600 flex items-center justify-center gap-2"
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> Export Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
