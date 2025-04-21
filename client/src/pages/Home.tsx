import React from "react";
import { UploadZone } from "@/components/UploadZone";
import { ProcessingArea } from "@/components/ProcessingArea";
import { ReviewGrid } from "@/components/ReviewGrid";
import { Dashboard } from "@/components/Dashboard";
import { ExportOptions } from "@/components/ExportOptions";

const Home: React.FC = () => {
  return (
    <>
      {/* Upload Zone */}
      <UploadZone className="mb-10" />
      
      {/* Processing Area - only shows when files are uploaded */}
      <ProcessingArea className="mb-10" />
      
      {/* Review Grid - only shows when data is extracted */}
      <ReviewGrid className="mb-10" />
      
      {/* Dashboard with visualizations */}
      <Dashboard className="mb-10" />
      
      {/* Export Options */}
      <ExportOptions className="mb-10" />
    </>
  );
};

export default Home;
