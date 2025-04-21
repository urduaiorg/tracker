import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "chart.js/auto";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { useBrand } from "@/contexts/BrandContext";
import { GripHorizontal, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChartSectionProps {
  className?: string;
}

export const ChartSection: React.FC<ChartSectionProps> = ({ className }) => {
  const { analytics } = useAnalytics();
  const { brandSettings } = useBrand();
  const growthChartRef = useRef<HTMLCanvasElement>(null);
  const performanceChartRef = useRef<HTMLCanvasElement>(null);
  const growthChartInstance = useRef<Chart | null>(null);
  const performanceChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (growthChartRef.current && performanceChartRef.current) {
      // Clean up previous chart instances
      if (growthChartInstance.current) {
        growthChartInstance.current.destroy();
      }
      if (performanceChartInstance.current) {
        performanceChartInstance.current.destroy();
      }

      // Create growth chart
      const growthCtx = growthChartRef.current.getContext("2d");
      if (growthCtx) {
        growthChartInstance.current = new Chart(growthCtx, {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Instagram",
                data: [65000, 69000, 74000, 79000, 84000, 89000],
                borderColor: "#8B5CF6",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
                tension: 0.3,
                fill: true
              },
              {
                label: "YouTube",
                data: [120000, 125000, 134000, 139000, 148000, 156000],
                borderColor: "#EF4444",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                tension: 0.3,
                fill: true
              },
              {
                label: "TikTok",
                data: [580000, 650000, 720000, 790000, 860000, 920000],
                borderColor: "#000000",
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                tension: 0.3,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: false,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)"
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }

      // Create performance chart
      const perfCtx = performanceChartRef.current.getContext("2d");
      if (perfCtx) {
        performanceChartInstance.current = new Chart(perfCtx, {
          type: "bar",
          data: {
            labels: ["Reels", "Stories", "Posts", "Videos", "Shorts"],
            datasets: [
              {
                label: "Engagement Rate",
                data: [8.7, 5.2, 4.3, 6.8, 9.2],
                backgroundColor: [
                  "#3B82F6",
                  "#8B5CF6",
                  "#10B981",
                  "#EF4444",
                  "#F59E0B"
                ]
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 10,
                ticks: {
                  callback: function(value) {
                    return value + "%";
                  }
                },
                grid: {
                  color: "rgba(0, 0, 0, 0.05)"
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }
    }

    // Cleanup function
    return () => {
      if (growthChartInstance.current) {
        growthChartInstance.current.destroy();
      }
      if (performanceChartInstance.current) {
        performanceChartInstance.current.destroy();
      }
    };
  }, [analytics, brandSettings]);

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Audience Growth</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 inline-block bg-primary rounded-full"></span>
                Instagram
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 inline-block bg-red-500 rounded-full"></span>
                YouTube
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 inline-block bg-black rounded-full"></span>
                TikTok
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-64 w-full">
            <canvas ref={growthChartRef}></canvas>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Content Performance</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
              <GripHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-64 w-full">
            <canvas ref={performanceChartRef}></canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
