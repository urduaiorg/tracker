import React from "react";
import { Link, useLocation } from "wouter";
import { Home, BarChart2, Upload, Download, PieChart, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [location] = useLocation();

  const navItems = [
    { id: "dashboard", path: "/", icon: <Home className="text-xl" />, label: "Dashboard", active: location === "/" },
    { id: "analytics", path: "/", icon: <BarChart2 className="text-xl" />, label: "Analytics", active: false },
    { id: "demographics", path: "/", icon: <PieChart className="text-xl" />, label: "Demographics", active: false },
    { id: "upload", path: "/", icon: <Upload className="text-xl" />, label: "Upload Data", active: false },
    { id: "export", path: "/", icon: <Download className="text-xl" />, label: "Export Kit", active: false },
  ];

  return (
    <div className={cn(
      "bg-white shadow-md lg:w-64 w-full lg:h-screen overflow-y-auto flex-shrink-0 border-r border-gray-200",
      className
    )}>
      <div className="p-5 flex justify-between items-center lg:justify-start lg:flex-col lg:items-start gap-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary p-2 rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M3 3v18h18"></path>
              <path d="m19 9-5 5-4-4-3 3"></path>
            </svg>
          </div>
          <span className="font-heading font-semibold text-xl">Urdu AI Tracker</span>
        </div>
        
        <div className="lg:mt-12 flex lg:flex-col lg:w-full gap-2">
          {navItems.map((item) => (
            <Link key={item.id} href={item.path}>
              <div className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg w-full cursor-pointer",
                item.active 
                  ? "text-primary bg-blue-50" 
                  : "text-gray-600 hover:bg-gray-100"
              )}>
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="hidden lg:block p-5 mt-auto">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium mb-2">Need help?</h5>
          <p className="text-sm text-gray-600 mb-3">Check our documentation or contact support</p>
          <button className="text-primary text-sm font-medium flex items-center gap-1">
            <HelpCircle className="w-4 h-4" /> Get Support
          </button>
        </div>
      </div>
    </div>
  );
};
