import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Analytics, ExportOptions, BrandSettings } from "@/types";

/**
 * Export the dashboard to a PDF document
 */
export const exportToPDF = async (
  elementId: string,
  exportOptions: ExportOptions,
  brandSettings?: BrandSettings | null
): Promise<string> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Capture the element as a canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow loading cross-origin images
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    // Create a PDF with the right dimensions
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Calculate aspect ratio to fit within A4
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

    // Add metadata if brand settings are available
    if (brandSettings) {
      pdf.setProperties({
        title: `Media Kit - ${brandSettings.name || "Content Creator"}`,
        subject: "Social Media Analytics",
        author: brandSettings.name || "Content Creator",
        creator: "Made with Urdu AI Tracker (www.urduai.org)",
      });
    }

    // Add watermark if needed
    if (exportOptions.addWatermark) {
      const watermarkText = "Built by www.urduai.org";
      pdf.setFontSize(10);
      pdf.setTextColor(200, 200, 200);
      pdf.text(watermarkText, 105, 290, { align: "center" });
    }

    // Return as data URL
    return pdf.output("datauristring");
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    throw error;
  }
};

/**
 * Export the dashboard to a JPEG image
 */
export const exportToJPEG = async (
  elementId: string,
  quality = 0.95,
  exportOptions?: ExportOptions
): Promise<string> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Capture the element as a canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow loading cross-origin images
      allowTaint: true,
      backgroundColor: "#ffffff",
    });
    
    // Add watermark if needed
    if (exportOptions?.addWatermark) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = '12px Arial';
        ctx.fillStyle = 'rgba(200, 200, 200, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText('Built by www.urduai.org', canvas.width / 2, canvas.height - 20);
      }
    }

    // Return as data URL
    return canvas.toDataURL("image/jpeg", quality);
  } catch (error) {
    console.error("Error exporting to JPEG:", error);
    throw error;
  }
};

/**
 * Export data based on selected format
 */
export const exportData = async (
  elementId: string,
  exportOptions: ExportOptions,
  brandSettings?: BrandSettings | null
): Promise<string> => {
  switch (exportOptions.format) {
    case "pdf":
      return exportToPDF(elementId, exportOptions, brandSettings);
    case "jpeg":
      return exportToJPEG(elementId, 0.95, exportOptions);
    case "html":
      // For HTML export, we'd need to create a standalone HTML file
      // This is a placeholder implementation
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID "${elementId}" not found`);
      }
      return `data:text/html;charset=utf-8,${encodeURIComponent(element.outerHTML)}`;
    default:
      throw new Error(`Unsupported export format: ${exportOptions.format}`);
  }
};

/**
 * Download a data URL as a file
 */
export const downloadDataUrl = (dataUrl: string, filename: string): void => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate filename based on export options and brand settings
 */
export const generateFilename = (
  exportOptions: ExportOptions,
  brandSettings?: BrandSettings | null
): string => {
  const dateStr = new Date().toISOString().split("T")[0];
  const nameStr = (brandSettings?.name || "ContentCreator").replace(/\s+/g, "");
  const extension = exportOptions.format === "html" ? "html" : 
                   exportOptions.format === "pdf" ? "pdf" : "jpg";
  
  return `MediaKit_${nameStr}_${dateStr}.${extension}`;
};
