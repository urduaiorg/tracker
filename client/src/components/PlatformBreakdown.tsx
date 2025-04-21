import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { useAnalytics } from "@/contexts/AnalyticsContext";

interface PlatformBreakdownProps {
  className?: string;
}

interface PlatformData {
  platform: string;
  handle: string;
  metrics: {
    key: string;
    label: string;
    value: string;
    progress: number;
  }[];
}

// Sample platform data
const platformsData: PlatformData[] = [
  {
    platform: "instagram",
    handle: "@sarahjcreates",
    metrics: [
      { key: "followers", label: "Followers", value: "89.4K", progress: 70 },
      { key: "engagement", label: "Engagement", value: "6.7%", progress: 65 },
      { key: "reach", label: "Reach", value: "1.2M", progress: 85 },
    ],
  },
  {
    platform: "youtube",
    handle: "Sarah Johnson Travels",
    metrics: [
      { key: "subscribers", label: "Subscribers", value: "156.2K", progress: 90 },
      { key: "watchTime", label: "Watch Time", value: "872K hrs", progress: 75 },
      { key: "ctr", label: "CTR", value: "4.8%", progress: 50 },
    ],
  },
  {
    platform: "tiktok",
    handle: "@sarahjcreates",
    metrics: [
      { key: "followers", label: "Followers", value: "920.7K", progress: 95 },
      { key: "views", label: "Views", value: "3.5M", progress: 80 },
      { key: "shares", label: "Shares", value: "142K", progress: 65 },
    ],
  },
];

export const PlatformBreakdown: React.FC<PlatformBreakdownProps> = ({ className }) => {
  const { analytics } = useAnalytics();

  // In a real application, this component would process analytics data
  // to generate platform-specific metrics

  return (
    <Card className={`bg-white shadow-sm border border-gray-100 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Platform Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platformsData.map((platform) => (
            <div
              key={platform.platform}
              className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <PlatformIcon platform={platform.platform as any} />
                <div>
                  <h5 className="font-medium">
                    {platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1)}
                  </h5>
                  <p className="text-sm text-gray-600">{platform.handle}</p>
                </div>
              </div>

              <div className="space-y-3">
                {platform.metrics.map((metric) => (
                  <div key={metric.key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{metric.label}</span>
                      <span className="font-medium">{metric.value}</span>
                    </div>
                    <Progress
                      value={metric.progress}
                      className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden"
                      indicatorClassName={
                        platform.platform === "instagram"
                          ? "bg-purple-500"
                          : platform.platform === "youtube"
                          ? "bg-red-500"
                          : "bg-black"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
