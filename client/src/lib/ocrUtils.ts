import { OcrResult, MetricData, PlatformType } from "@/types";

/**
 * Regex patterns for extracting metrics from OCR text
 */
const metricPatterns = {
  followers: /(Followers|سبسکرائبرز|Subscribers|Following)[\s:]*([\d,\.]+)/gi,
  likes: /(Likes|پسند)[\s:]*([\d,\.]+)/gi,
  views: /(Views|دیکھا گیا)[\s:]*([\d,\.]+)/gi,
  shares: /(Shares|شیئر)[\s:]*([\d,\.]+)/gi,
  comments: /(Comments|تبصرے)[\s:]*([\d,\.]+)/gi,
  engagement: /(Engagement|مصروفیت)[\s:]*([\d,\.%]+)/gi,
  impressions: /(Impressions|تاثرات)[\s:]*([\d,\.]+)/gi,
  reach: /(Reach|پہنچ)[\s:]*([\d,\.]+)/gi,
  watchTime: /(Watch Time|watch time|وقت دیکھا)[\s:]*([\d,\.]+)[\s]*(hours|mins|minutes|hrs)/gi,
};

/**
 * Platform detection patterns
 */
const platformPatterns = {
  instagram: /(Instagram|انسٹاگرام)/i,
  youtube: /(YouTube|یوٹیوب)/i,
  tiktok: /(TikTok|ٹک ٹاک)/i,
  twitter: /(Twitter|X|ٹویٹر)/i,
  facebook: /(Facebook|Meta|فیس بک)/i,
  linkedin: /(LinkedIn|لنکڈان)/i,
};

/**
 * Detects the platform from OCR text
 */
export const detectPlatform = (text: string): PlatformType => {
  for (const [platform, pattern] of Object.entries(platformPatterns)) {
    if (pattern.test(text)) {
      return platform as PlatformType;
    }
  }
  return "other";
};

/**
 * Date/period detection
 */
export const detectPeriod = (text: string): string | undefined => {
  // Match Month YYYY or MM/DD/YYYY patterns
  const datePattern = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4}/i;
  const match = text.match(datePattern);
  return match ? match[0] : undefined;
};

/**
 * Extracts metrics from OCR text
 */
export const extractMetrics = (text: string): MetricData[] => {
  const platform = detectPlatform(text);
  const period = detectPeriod(text);
  const metrics: MetricData[] = [];

  // Process each metric pattern
  for (const [metricName, pattern] of Object.entries(metricPatterns)) {
    // Reset the regex lastIndex
    pattern.lastIndex = 0;
    
    let match;
    while ((match = pattern.exec(text)) !== null) {
      // Remove commas and convert to string
      const rawValue = match[2].replace(/,/g, "");
      
      metrics.push({
        platform,
        metricName,
        metricValue: rawValue,
        period,
        confidence: 90, // Default confidence
      });
    }
  }

  return metrics;
};

/**
 * Clean and normalize OCR text
 */
export const cleanOcrText = (text: string): string => {
  return text
    .replace(/\s+/g, " ")
    .trim();
};
