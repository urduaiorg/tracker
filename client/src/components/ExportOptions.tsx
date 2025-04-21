import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download, Eye, FileImage, File, Code, 
  Bookmark, Calendar, TrendingUp, DatabaseIcon, 
  Image, CheckCircle2, BadgeCheck, Users, BarChart, Globe,
  Zap, LineChart, Radio, PieChart
} from "lucide-react";
import { useBrand } from "@/contexts/BrandContext";
import { useToast } from "@/hooks/use-toast";
import { exportData, downloadDataUrl, generateFilename } from "@/lib/exportUtils";
import { ExportFormat, TemplateStyle, MetricType } from "@/types";

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

  const handleMetricToggle = (metric: MetricType) => {
    const currentMetrics = [...exportOptions.selectedMetrics];

    if (currentMetrics.includes(metric)) {
      // If at least one metric remains selected, allow deselection
      if (currentMetrics.length > 1) {
        const newMetrics = currentMetrics.filter(m => m !== metric);
        updateExportOptions({ selectedMetrics: newMetrics });
      } else {
        // Don't allow deselecting the last metric
        toast({
          title: "At least one metric required",
          description: "You must select at least one metric to include in your export",
          variant: "destructive",
        });
      }
    } else {
      // Add the metric
      updateExportOptions({ selectedMetrics: [...currentMetrics, metric] });
    }
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

  // If brand settings aren't loaded yet, show a loading state
  if (!brandSettings) {
    return (
      <div className={className}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-heading font-semibold">Export Options</h3>
        </div>
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-6 flex justify-center items-center h-80">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading export options...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <h4 className="font-medium mb-3">Report Card Features</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Checkbox 
                    id="include-qr" 
                    checked={exportOptions.includeQrCodes}
                    onCheckedChange={(checked) => handleOptionChange('includeQrCodes', checked as boolean)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-white"
                  />
                  <Label htmlFor="include-qr" className="flex-1 cursor-pointer">
                    <div className="font-medium flex items-center gap-2">
                      <Bookmark className="h-4 w-4 text-primary" />
                      <span>QR Code Links</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Include scannable QR codes for all your social profiles</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Checkbox 
                    id="include-trends" 
                    checked={exportOptions.includeGrowthTrends}
                    onCheckedChange={(checked) => handleOptionChange('includeGrowthTrends', checked as boolean)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-white"
                  />
                  <Label htmlFor="include-trends" className="flex-1 cursor-pointer">
                    <div className="font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span>Growth Trends</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Display growth charts for key metrics over time</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border border-primary/30 rounded-lg bg-primary/5 hover:bg-primary/10 cursor-not-allowed transition-colors">
                  <Checkbox 
                    id="add-watermark" 
                    checked={exportOptions.addWatermark}
                    disabled={true}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-white"
                  />
                  <Label htmlFor="add-watermark" className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-primary" />
                      <span>Built by UrduAI</span>
                      <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-white">
                        Required
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">All exports include "Built by www.urduai.org" watermark</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Checkbox 
                    id="include-raw" 
                    checked={exportOptions.includeRawData}
                    onCheckedChange={(checked) => handleOptionChange('includeRawData', checked as boolean)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-white"
                  />
                  <Label htmlFor="include-raw" className="flex-1 cursor-pointer">
                    <div className="font-medium flex items-center gap-2">
                      <DatabaseIcon className="h-4 w-4 text-primary" />
                      <span>Raw Data Table</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Include complete data tables for reference</p>
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Selection Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="font-medium mb-4">Select Metrics to Include</h4>
            <p className="text-sm text-gray-500 mb-4">Choose which metrics to display in your media kit</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <div 
                className={`rounded-lg border p-3 cursor-pointer transition-all ${exportOptions?.selectedMetrics?.includes('followers') 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => handleMetricToggle('followers')}
              >
                <div className="flex items-center gap-2">
                  <Users className={`h-5 w-5 ${exportOptions?.selectedMetrics?.includes('followers') ? 'text-primary' : 'text-gray-500'}`} />
                  <div className="text-sm font-medium">Followers</div>
                </div>
                {exportOptions?.selectedMetrics?.includes('followers') && (
                  <div className="mt-2 bg-primary/10 rounded-md p-1 inline-flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-1.5"></div>
                    <span className="text-xs text-primary font-medium">Selected</span>
                  </div>
                )}
              </div>

              <div 
                className={`rounded-lg border p-3 cursor-pointer transition-all ${exportOptions?.selectedMetrics?.includes('engagement') 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => handleMetricToggle('engagement')}
              >
                <div className="flex items-center gap-2">
                  <Zap className={`h-5 w-5 ${exportOptions?.selectedMetrics?.includes('engagement') ? 'text-primary' : 'text-gray-500'}`} />
                  <div className="text-sm font-medium">Engagement</div>
                </div>
                {exportOptions?.selectedMetrics?.includes('engagement') && (
                  <div className="mt-2 bg-primary/10 rounded-md p-1 inline-flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-1.5"></div>
                    <span className="text-xs text-primary font-medium">Selected</span>
                  </div>
                )}
              </div>

              <div 
                className={`rounded-lg border p-3 cursor-pointer transition-all ${exportOptions?.selectedMetrics?.includes('reach') 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => handleMetricToggle('reach')}
              >
                <div className="flex items-center gap-2">
                  <Globe className={`h-5 w-5 ${exportOptions?.selectedMetrics?.includes('reach') ? 'text-primary' : 'text-gray-500'}`} />
                  <div className="text-sm font-medium">Reach</div>
                </div>
                {exportOptions?.selectedMetrics?.includes('reach') && (
                  <div className="mt-2 bg-primary/10 rounded-md p-1 inline-flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-1.5"></div>
                    <span className="text-xs text-primary font-medium">Selected</span>
                  </div>
                )}
              </div>

              <div 
                className={`rounded-lg border p-3 cursor-pointer transition-all ${exportOptions?.selectedMetrics?.includes('impressions') 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => handleMetricToggle('impressions')}
              >
                <div className="flex items-center gap-2">
                  <BarChart className={`h-5 w-5 ${exportOptions?.selectedMetrics?.includes('impressions') ? 'text-primary' : 'text-gray-500'}`} />
                  <div className="text-sm font-medium">Impressions</div>
                </div>
                {exportOptions?.selectedMetrics?.includes('impressions') && (
                  <div className="mt-2 bg-primary/10 rounded-md p-1 inline-flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-1.5"></div>
                    <span className="text-xs text-primary font-medium">Selected</span>
                  </div>
                )}
              </div>

              <div 
                className={`rounded-lg border p-3 cursor-pointer transition-all ${exportOptions?.selectedMetrics?.includes('views') 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => handleMetricToggle('views')}
              >
                <div className="flex items-center gap-2">
                  <LineChart className={`h-5 w-5 ${exportOptions?.selectedMetrics?.includes('views') ? 'text-primary' : 'text-gray-500'}`} />
                  <div className="text-sm font-medium">Views</div>
                </div>
                {exportOptions?.selectedMetrics?.includes('views') && (
                  <div className="mt-2 bg-primary/10 rounded-md p-1 inline-flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-1.5"></div>
                    <span className="text-xs text-primary font-medium">Selected</span>
                  </div>
                )}
              </div>

              <div 
                className={`rounded-lg border p-3 cursor-pointer transition-all ${exportOptions?.selectedMetrics?.includes('demographics') 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => handleMetricToggle('demographics')}
              >
                <div className="flex items-center gap-2">
                  <PieChart className={`h-5 w-5 ${exportOptions?.selectedMetrics?.includes('demographics') ? 'text-primary' : 'text-gray-500'}`} />
                  <div className="text-sm font-medium">Demographics</div>
                </div>
                {exportOptions?.selectedMetrics?.includes('demographics') && (
                  <div className="mt-2 bg-primary/10 rounded-md p-1 inline-flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-1.5"></div>
                    <span className="text-xs text-primary font-medium">Selected</span>
                  </div>
                )}
              </div>

              <div 
                className={`rounded-lg border p-3 cursor-pointer transition-all ${exportOptions?.selectedMetrics?.includes('growth') 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => handleMetricToggle('growth')}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className={`h-5 w-5 ${exportOptions?.selectedMetrics?.includes('growth') ? 'text-primary' : 'text-gray-500'}`} />
                  <div className="text-sm font-medium">Growth Rate</div>
                </div>
                {exportOptions?.selectedMetrics?.includes('growth') && (
                  <div className="mt-2 bg-primary/10 rounded-md p-1 inline-flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-1.5"></div>
                    <span className="text-xs text-primary font-medium">Selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="w-full lg:w-auto">
                <div className="flex flex-col">
                  <h4 className="font-medium mb-2">Preview & Download</h4>
                  <p className="text-sm text-gray-500 mb-3">Generate your professional media kit with your brand settings</p>

                  <div className="relative group">
                    <div className="bg-gray-100 rounded-xl w-full lg:w-48 h-32 flex items-center justify-center text-gray-400 overflow-hidden">
                      {exportOptions.template === "modern" && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/30 z-0"></div>
                      )}
                      {exportOptions.template === "vibrant" && (
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-pink-500/30 z-0"></div>
                      )}
                      {exportOptions.template === "corporate" && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/30 z-0"></div>
                      )}

                      <div className="relative z-10 flex flex-col items-center">
                        <FileImage className="h-10 w-10 mb-2" />
                        <div className="text-xs text-center">
                          <span className="font-medium">{brandSettings?.name || "Your Name"}</span>
                          <div className="text-gray-500 text-[10px] mt-0.5">Built by www.urduai.org</div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-2 right-2 opacity-70">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full lg:w-auto">
                <div className="text-sm p-3 bg-blue-50 text-blue-800 rounded-lg max-w-md">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Your media kit will be exported with <span className="font-medium">www.urduai.org</span> branding. No data is stored - once refreshed/closed, all data is gone.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-1">
                  <Button 
                    variant="outline" 
                    onClick={handlePreview}
                    className="flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" /> Preview
                  </Button>
                  <Button 
                    className="bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-2 py-6 px-8"
                    onClick={handleExport}
                    disabled={isExporting}
                  >
                    {isExporting ? (
                      <div className="flex items-center">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                      </div>
                    ) : (
                      <>
                        <Download className="h-4 w-4" /> Export Media Kit
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};