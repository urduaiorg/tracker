import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Platform types
export const platformEnum = z.enum(["instagram", "youtube", "tiktok", "twitter", "facebook", "linkedin", "other"]);

// Analytics entry schema
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  platform: text("platform").notNull(),
  metricName: text("metric_name").notNull(),
  metricValue: text("metric_value").notNull(),
  period: text("period"),
  confidence: integer("confidence"),
  sourceType: text("source_type"), // "screenshot", "pdf", "spreadsheet"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

// Brand settings schema
export const brandSettings = pgTable("brand_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name"),
  handle: text("handle"),
  bio: text("bio"),
  logo: text("logo"), // URL/Base64
  backgroundImage: text("background_image"), // URL/Base64
  primaryColor: text("primary_color"),
  secondaryColor: text("secondary_color"),
  accentColor: text("accent_color"),
  language: text("language").default("en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBrandSettingsSchema = createInsertSchema(brandSettings).omit({
  id: true,
  createdAt: true,
});

// Analytics entry type definitions
export type PlatformType = z.infer<typeof platformEnum>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

export type BrandSettings = typeof brandSettings.$inferSelect;
export type InsertBrandSettings = z.infer<typeof insertBrandSettingsSchema>;

// Frontend types for file processing
export const fileProcessingStatusEnum = z.enum(["pending", "processing", "completed", "error"]);
export type FileProcessingStatus = z.infer<typeof fileProcessingStatusEnum>;

export const fileTypeEnum = z.enum(["image", "pdf", "spreadsheet", "unknown"]);
export type FileType = z.infer<typeof fileTypeEnum>;

export type ProcessingFile = {
  id: string;
  name: string;
  size: number;
  type: FileType;
  status: FileProcessingStatus;
  progress: number;
  error?: string;
  data?: Analytics[];
};

// Export options
export type ExportFormat = "pdf" | "jpeg" | "html";
export type TemplateStyle = "modern" | "minimal" | "vibrant" | "corporate";

export type ExportOptions = {
  format: ExportFormat;
  template: TemplateStyle;
  includeQrCodes: boolean;
  includeGrowthTrends: boolean;
  addWatermark: boolean;
  includeRawData: boolean;
};
