import React, { useState, useRef, useCallback } from "react";
import { useBrand } from "@/contexts/BrandContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, User, Camera, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BrandSettings } from "@/types";
import { fileToBase64 } from "@/lib/fileUtils";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BrandPersonalizationProps {
  className?: string;
}

export const BrandPersonalization: React.FC<BrandPersonalizationProps> = ({ className }) => {
  const { brandSettings, updateBrandSettings } = useBrand();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<BrandSettings & { backgroundOpacity?: number }>>(
    brandSettings ? { ...brandSettings, backgroundOpacity: brandSettings.backgroundOpacity || 30 } : {}
  );
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>, imageType: 'logo' | 'backgroundImage') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Please select an image under 2MB`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert file to base64
      const base64 = await fileToBase64(file);
      setFormData((prev) => ({
        ...prev,
        [imageType]: base64,
      }));
      toast({
        title: imageType === 'logo' ? "Logo uploaded" : "Background image uploaded",
        description: imageType === 'logo' 
          ? "Your logo has been uploaded successfully" 
          : "Your background image has been uploaded successfully",
      });
    } catch (error) {
      console.error(`Error uploading ${imageType}:`, error);
      toast({
        title: "Error",
        description: `Failed to upload ${imageType === 'logo' ? 'logo' : 'background image'}. Please try again.`,
        variant: "destructive",
      });
    }
  }, [toast]);
  
  const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(event, 'logo');
  }, [handleImageUpload]);
  
  const handleBackgroundUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(event, 'backgroundImage');
  }, [handleImageUpload]);

  if (!brandSettings) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Handle numeric inputs like background opacity
    if (name === "backgroundOpacity") {
      setFormData({ ...formData, [name]: parseInt(value, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      await updateBrandSettings(formData);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Your brand settings have been updated.",
      });
    } catch (error) {
      console.error("Error saving brand settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleColorClick = (colorType: string, color: string) => {
    setFormData({
      ...formData,
      [colorType]: color,
    });
  };

  const removeLogo = () => {
    setFormData({
      ...formData,
      logo: "",
    });
  };
  
  const removeBackgroundImage = () => {
    setFormData({
      ...formData,
      backgroundImage: "",
    });
  };

  const triggerLogoUpload = () => {
    logoInputRef.current?.click();
  };
  
  const triggerBgImageUpload = () => {
    bgImageInputRef.current?.click();
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* Profile Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src={formData.logo || brandSettings.logo || undefined} alt={brandSettings.name || "Profile"} />
              <AvatarFallback className="bg-primary/5">
                <User className="w-8 h-8 text-primary/40" />
              </AvatarFallback>
            </Avatar>
            
            {isEditing && (
              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <button 
                    onClick={triggerLogoUpload}
                    className="p-1 bg-white rounded-full"
                    title="Upload logo"
                  >
                    <Camera className="w-4 h-4 text-primary" />
                  </button>
                  {formData.logo && (
                    <button 
                      onClick={removeLogo}
                      className="p-1 bg-white rounded-full"
                      title="Remove logo"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>
            )}
          </div>
          
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
                <Textarea
                  className="text-sm min-h-[60px]"
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleInputChange}
                  placeholder="Brief bio"
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
              <Button size="sm" onClick={handleSave} className="bg-primary hover:bg-primary/90">
                Save Changes
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
                        className="w-7 h-7 rounded-full border border-white shadow-sm transition-transform hover:scale-110"
                        style={{ backgroundColor: brandSettings.primaryColor || "#3B82F6" }}
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
                              className="w-8 h-8 rounded-full border border-white shadow-sm transition-transform hover:scale-110"
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
                        className="w-7 h-7 rounded-full border border-white shadow-sm transition-transform hover:scale-110"
                        style={{ backgroundColor: brandSettings.secondaryColor || "#10B981" }}
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
                              className="w-8 h-8 rounded-full border border-white shadow-sm transition-transform hover:scale-110"
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
                        className="w-7 h-7 rounded-full border border-white shadow-sm transition-transform hover:scale-110"
                        style={{ backgroundColor: (brandSettings.accentColor || "#F59E0B") as string }}
                      />
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
                              className="w-8 h-8 rounded-full border border-white shadow-sm transition-transform hover:scale-110"
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
                className="text-primary text-sm font-medium flex items-center gap-1 hover:bg-primary/5"
              >
                <Edit className="h-4 w-4" /> Customize Profile
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Background Image Section */}
      {isEditing && (
        <div className="mt-6 border-t pt-6">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary" />
            Dashboard Background
          </h4>
          
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                {formData.backgroundImage ? (
                  <div className="relative">
                    <img 
                      src={formData.backgroundImage} 
                      alt="Background preview" 
                      className="max-h-48 mx-auto rounded object-cover"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removeBackgroundImage}
                      className="mt-2 text-red-500 border-red-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Remove Background
                    </Button>
                  </div>
                ) : (
                  <div className="py-8">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 mb-3">Upload a background image for your dashboard</p>
                    <Button 
                      variant="outline" 
                      onClick={triggerBgImageUpload}
                      className="border-primary/20 text-primary"
                    >
                      <Upload className="h-4 w-4 mr-2" /> Select Image
                    </Button>
                    <input
                      ref={bgImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBackgroundUpload}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Background Opacity</Label>
                  <Input
                    type="range"
                    name="backgroundOpacity"
                    min="10"
                    max="100"
                    step="5"
                    value={formData.backgroundOpacity || 30}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Transparent</span>
                    <span>Opaque</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500">
                  Set a lower opacity to ensure dashboard content remains readable
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="border rounded-lg overflow-hidden h-60 relative">
                {formData.backgroundImage ? (
                  <>
                    <div 
                      className="absolute inset-0 bg-no-repeat bg-cover" 
                      style={{
                        backgroundImage: `url(${formData.backgroundImage})`,
                        opacity: (formData.backgroundOpacity || 30) / 100,
                      }}
                    />
                    <div className="absolute inset-0 bg-white/70"></div>
                    <div className="relative z-10 p-4">
                      <h3 className="text-lg font-medium">Dashboard Preview</h3>
                      <p className="text-gray-600">This shows how your background will look behind dashboard elements</p>
                      <div className="flex flex-wrap gap-3 mt-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm w-32 h-24 flex items-center justify-center">
                          Sample Widget
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm w-32 h-24 flex items-center justify-center">
                          Sample Widget
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <p>Upload a background image to see preview</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};
