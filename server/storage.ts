import { users, type User, type InsertUser, analytics, InsertAnalytics, Analytics, brandSettings, BrandSettings, InsertBrandSettings } from "@shared/schema";

// Modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Analytics methods
  getAnalytics(userId?: number): Promise<Analytics[]>;
  getAnalyticsByPlatform(userId: number, platform: string): Promise<Analytics[]>;
  createAnalytics(data: InsertAnalytics): Promise<Analytics>;
  updateAnalytics(id: number, data: Partial<Analytics>): Promise<Analytics>;
  deleteAnalytics(id: number): Promise<void>;
  
  // Brand settings methods
  getBrandSettings(userId: number): Promise<BrandSettings | undefined>;
  createBrandSettings(settings: InsertBrandSettings): Promise<BrandSettings>;
  updateBrandSettings(id: number, settings: Partial<BrandSettings>): Promise<BrandSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private analyticsData: Map<number, Analytics>;
  private brandSettingsData: Map<number, BrandSettings>;
  
  currentUserId: number;
  currentAnalyticsId: number;
  currentBrandSettingsId: number;

  constructor() {
    this.users = new Map();
    this.analyticsData = new Map();
    this.brandSettingsData = new Map();
    
    this.currentUserId = 1;
    this.currentAnalyticsId = 1;
    this.currentBrandSettingsId = 1;
    
    // Add a default user
    this.createUser({
      username: "demo_user",
      password: "password123"
    });
    
    // Add default brand settings
    this.createBrandSettings({
      userId: 1,
      name: "Sarah Johnson",
      handle: "@sarahjcreates",
      bio: "Lifestyle & Travel Content Creator",
      logo: "",
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      accentColor: "#F59E0B",
      language: "en"
    });
    
    // Add some sample analytics data
    this.createAnalytics({
      userId: 1,
      platform: "instagram",
      metricName: "followers",
      metricValue: "89423",
      period: "Apr 2023",
      confidence: 85,
      sourceType: "screenshot"
    });
    
    this.createAnalytics({
      userId: 1,
      platform: "youtube",
      metricName: "subscribers",
      metricValue: "156240",
      period: "Apr 2023",
      confidence: 98,
      sourceType: "pdf"
    });
    
    this.createAnalytics({
      userId: 1,
      platform: "tiktok",
      metricName: "views",
      metricValue: "3542871",
      period: "Mar-Apr 2023",
      confidence: 95,
      sourceType: "spreadsheet"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Analytics methods
  async getAnalytics(userId?: number): Promise<Analytics[]> {
    const analytics = Array.from(this.analyticsData.values());
    
    if (userId) {
      return analytics.filter(item => item.userId === userId);
    }
    
    return analytics;
  }
  
  async getAnalyticsByPlatform(userId: number, platform: string): Promise<Analytics[]> {
    return Array.from(this.analyticsData.values()).filter(
      item => item.userId === userId && item.platform === platform
    );
  }
  
  async createAnalytics(data: InsertAnalytics): Promise<Analytics> {
    const id = this.currentAnalyticsId++;
    const now = new Date();
    
    const analytics: Analytics = {
      ...data,
      id,
      createdAt: now
    };
    
    this.analyticsData.set(id, analytics);
    return analytics;
  }
  
  async updateAnalytics(id: number, data: Partial<Analytics>): Promise<Analytics> {
    const existing = this.analyticsData.get(id);
    
    if (!existing) {
      throw new Error(`Analytics with ID ${id} not found`);
    }
    
    const updated: Analytics = {
      ...existing,
      ...data,
    };
    
    this.analyticsData.set(id, updated);
    return updated;
  }
  
  async deleteAnalytics(id: number): Promise<void> {
    if (!this.analyticsData.has(id)) {
      throw new Error(`Analytics with ID ${id} not found`);
    }
    
    this.analyticsData.delete(id);
  }
  
  // Brand settings methods
  async getBrandSettings(userId: number): Promise<BrandSettings | undefined> {
    return Array.from(this.brandSettingsData.values()).find(
      settings => settings.userId === userId
    );
  }
  
  async createBrandSettings(settings: InsertBrandSettings): Promise<BrandSettings> {
    const id = this.currentBrandSettingsId++;
    const now = new Date();
    
    const brandSettings: BrandSettings = {
      ...settings,
      id,
      createdAt: now
    };
    
    this.brandSettingsData.set(id, brandSettings);
    return brandSettings;
  }
  
  async updateBrandSettings(id: number, settings: Partial<BrandSettings>): Promise<BrandSettings> {
    const existing = this.brandSettingsData.get(id);
    
    if (!existing) {
      throw new Error(`Brand settings with ID ${id} not found`);
    }
    
    const updated: BrandSettings = {
      ...existing,
      ...settings,
    };
    
    this.brandSettingsData.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
