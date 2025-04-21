import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Globe, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/hooks/use-lang";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { language, toggleLanguage } = useLang();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold">Urdu AI Tracker</h1>
              <p className="text-gray-600 mt-1">Transform your analytics into stunning modern report cards</p>
              <div className="text-xs text-amber-600 mt-1">Note: No data is stored once the page is refreshed/closed</div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={toggleLanguage}
                >
                  <Globe className="h-4 w-4" /> 
                  {language === "en" ? "English" : "اردو"}
                </Button>
              </div>
              
              <Button className="bg-primary text-white hover:bg-blue-600 flex items-center gap-2">
                <Plus className="h-4 w-4" /> New Project
              </Button>
            </div>
          </div>
          
          {/* Main Content */}
          {children}
        </div>
      </div>
    </div>
  );
};
