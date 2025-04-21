import React from "react";
import { BrandPersonalization } from "@/components/BrandPersonalization";
import { StatsOverview } from "@/components/StatsOverview";
import { ChartSection } from "@/components/ChartSection";
import { PlatformBreakdown } from "@/components/PlatformBreakdown";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  className?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ className }) => {
  return (
    <div id="dashboard" className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-heading font-semibold">Your Media Kit Dashboard</h3>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <CalendarIcon className="h-4 w-4 mr-1" /> Last 30 Days
          </Button>
        </div>
      </div>
      
      {/* Brand Personalization Bar */}
      <BrandPersonalization className="mb-6" />
      
      {/* Stats Overview */}
      <StatsOverview className="mb-6" />
      
      {/* Charts */}
      <ChartSection className="mb-6" />
      
      {/* Platform Breakdown */}
      <PlatformBreakdown className="mb-6" />
    </div>
  );
};
