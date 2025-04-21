import React, { useState } from "react";
import { useBrand } from "@/contexts/BrandContext";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Edit, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandSettings } from "@/types";

interface BrandPersonalizationProps {
  className?: string;
}

export const BrandPersonalization: React.FC<BrandPersonalizationProps> = ({ className }) => {
  const { brandSettings, updateBrandSettings } = useBrand();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<BrandSettings>>(brandSettings || {});

  if (!brandSettings) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await updateBrandSettings(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving brand settings:", error);
    }
  };

  const handleColorClick = (colorType: string, color: string) => {
    setFormData({
      ...formData,
      [colorType]: color,
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            {brandSettings.logo ? (
              <img src={brandSettings.logo} alt={brandSettings.name || "Profile"} />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </Avatar>
          <div>
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <Input
                  className="h-8 text-sm"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  placeholder="Your name"
                />
                <Input
                  className="h-8 text-sm"
                  name="handle"
                  value={formData.handle || ""}
                  onChange={handleInputChange}
                  placeholder="@handle"
                />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <h4 className="font-medium">{brandSettings.name || "Your Name"}</h4>
                  <span className="text-gray-500 text-sm">{brandSettings.handle || "@handle"}</span>
                </div>
                <p className="text-sm text-gray-600">{brandSettings.bio || "Content Creator"}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 ml-auto">
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Brand Colors:</span>
                <div className="flex gap-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="w-6 h-6 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: brandSettings.primaryColor }}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3">
                      <div className="space-y-2">
                        <Label>Select Primary Color</Label>
                        <div className="grid grid-cols-6 gap-2">
                          {[
                            "#3B82F6", "#10B981", "#F59E0B", "#EF4444",
                            "#8B5CF6", "#EC4899", "#6366F1", "#0EA5E9"
                          ].map((color) => (
                            <button
                              key={color}
                              className="w-8 h-8 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: color }}
                              onClick={() => handleColorClick("primaryColor", color)}
                            />
                          ))}
                        </div>
                        <Input
                          type="color"
                          name="primaryColor"
                          value={formData.primaryColor || "#3B82F6"}
                          onChange={handleInputChange}
                          className="w-full h-8 mt-2"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="w-6 h-6 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: brandSettings.secondaryColor }}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3">
                      <div className="space-y-2">
                        <Label>Select Secondary Color</Label>
                        <div className="grid grid-cols-6 gap-2">
                          {[
                            "#10B981", "#3B82F6", "#F59E0B", "#EF4444",
                            "#8B5CF6", "#EC4899", "#6366F1", "#0EA5E9"
                          ].map((color) => (
                            <button
                              key={color}
                              className="w-8 h-8 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: color }}
                              onClick={() => handleColorClick("secondaryColor", color)}
                            />
                          ))}
                        </div>
                        <Input
                          type="color"
                          name="secondaryColor"
                          value={formData.secondaryColor || "#10B981"}
                          onChange={handleInputChange}
                          className="w-full h-8 mt-2"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="w-6 h-6 rounded-full bg-gray-200 border border-white shadow-sm flex items-center justify-center text-gray-500"
                      >
                        <span className="text-xs">+</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3">
                      <div className="space-y-2">
                        <Label>Select Accent Color</Label>
                        <div className="grid grid-cols-6 gap-2">
                          {[
                            "#F59E0B", "#3B82F6", "#10B981", "#EF4444",
                            "#8B5CF6", "#EC4899", "#6366F1", "#0EA5E9"
                          ].map((color) => (
                            <button
                              key={color}
                              className="w-8 h-8 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: color }}
                              onClick={() => handleColorClick("accentColor", color)}
                            />
                          ))}
                        </div>
                        <Input
                          type="color"
                          name="accentColor"
                          value={formData.accentColor || "#F59E0B"}
                          onChange={handleInputChange}
                          className="w-full h-8 mt-2"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-primary text-sm font-medium flex items-center gap-1"
              >
                <Edit className="h-4 w-4" /> Customize
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
