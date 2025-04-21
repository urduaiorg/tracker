import React from "react";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, Users, Eye, Heart } from "lucide-react";

interface StatsOverviewProps {
  className?: string;
}

// Simulated stats calculations
const calculateStats = (analytics: any[]) => {
  // In a real application, this would perform actual calculations based on analytics data
  return {
    followers: {
      total: "246.5K",
      change: 12.3,
      isPositive: true,
    },
    impressions: {
      total: "4.2M",
      change: 8.7,
      isPositive: true,
    },
    engagement: {
      total: "5.8%",
      change: 1.2,
      isPositive: false,
    },
  };
};

export const StatsOverview: React.FC<StatsOverviewProps> = ({ className }) => {
  const { analytics } = useAnalytics();
  const stats = calculateStats(analytics);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Followers</p>
              <h3 className="text-2xl font-semibold">{stats.followers.total}</h3>
              <div className={`flex items-center gap-1 mt-1 ${stats.followers.isPositive ? 'text-green-600' : 'text-red-600'} text-sm`}>
                {stats.followers.isPositive ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                <span>{stats.followers.change}%</span>
                <span className="text-gray-500 text-xs">vs last month</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-primary">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-100">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Impressions</p>
              <h3 className="text-2xl font-semibold">{stats.impressions.total}</h3>
              <div className={`flex items-center gap-1 mt-1 ${stats.impressions.isPositive ? 'text-green-600' : 'text-red-600'} text-sm`}>
                {stats.impressions.isPositive ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                <span>{stats.impressions.change}%</span>
                <span className="text-gray-500 text-xs">vs last month</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
              <Eye className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-100">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
              <h3 className="text-2xl font-semibold">{stats.engagement.total}</h3>
              <div className={`flex items-center gap-1 mt-1 ${stats.engagement.isPositive ? 'text-green-600' : 'text-red-600'} text-sm`}>
                {stats.engagement.isPositive ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                <span>{stats.engagement.change}%</span>
                <span className="text-gray-500 text-xs">vs last month</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
              <Heart className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
