/**
 * Simple internationalization utility for English and Urdu
 */

type TranslationKey = 
  | 'appName'
  | 'dashboard'
  | 'history'
  | 'templates'
  | 'settings'
  | 'needHelp'
  | 'getSupport'
  | 'mediaKitCreator'
  | 'transformAnalytics'
  | 'dropFiles'
  | 'uploadInstructions'
  | 'selectFiles'
  | 'processingFiles'
  | 'extractedData'
  | 'editAll'
  | 'platform'
  | 'metric'
  | 'value'
  | 'period'
  | 'confidence'
  | 'actions'
  | 'loading'
  | 'complete'
  | 'error'
  | 'remove'
  | 'cancel'
  | 'view'
  | 'mediaKitDashboard'
  | 'last30Days'
  | 'brandColors'
  | 'customize'
  | 'followers'
  | 'engagement'
  | 'impressions'
  | 'vsLastMonth'
  | 'audienceGrowth'
  | 'contentPerformance'
  | 'platformBreakdown'
  | 'exportOptions'
  | 'exportFormat'
  | 'pdfDocument'
  | 'jpegImages'
  | 'interactiveHtml'
  | 'templateStyle'
  | 'modern'
  | 'minimal'
  | 'vibrant'
  | 'corporate'
  | 'additionalOptions'
  | 'includeQrCodes'
  | 'includeGrowthTrends'
  | 'addWatermark'
  | 'includeRawData'
  | 'exportPreview'
  | 'preview'
  | 'exportNow'
  | 'success'
  | 'exportSuccess'
  | 'dismiss';

const translations: Record<"en" | "ur", Record<TranslationKey, string>> = {
  en: {
    appName: "SocialKit",
    dashboard: "Dashboard",
    history: "History",
    templates: "Templates",
    settings: "Settings",
    needHelp: "Need help?",
    getSupport: "Get Support",
    mediaKitCreator: "Media Kit Creator",
    transformAnalytics: "Transform your analytics into stunning shareable assets",
    dropFiles: "Drop your files here",
    uploadInstructions: "Upload screenshots, PDFs, or spreadsheets to extract analytics",
    selectFiles: "Select Files",
    processingFiles: "Processing Files",
    extractedData: "Review Extracted Data",
    editAll: "Edit All",
    platform: "Platform",
    metric: "Metric",
    value: "Value",
    period: "Period",
    confidence: "Confidence",
    actions: "Actions",
    loading: "Loading...",
    complete: "Complete",
    error: "Error",
    remove: "Remove",
    cancel: "Cancel",
    view: "View",
    mediaKitDashboard: "Your Media Kit Dashboard",
    last30Days: "Last 30 Days",
    brandColors: "Brand Colors:",
    customize: "Customize",
    followers: "Followers",
    engagement: "Engagement Rate",
    impressions: "Monthly Impressions",
    vsLastMonth: "vs last month",
    audienceGrowth: "Audience Growth",
    contentPerformance: "Content Performance",
    platformBreakdown: "Platform Breakdown",
    exportOptions: "Export Options",
    exportFormat: "Export Format",
    pdfDocument: "PDF Document",
    jpegImages: "JPEG Images",
    interactiveHtml: "Interactive HTML",
    templateStyle: "Template Style",
    modern: "Modern",
    minimal: "Minimal",
    vibrant: "Vibrant",
    corporate: "Corporate",
    additionalOptions: "Additional Options",
    includeQrCodes: "Include QR Codes",
    includeGrowthTrends: "Include Growth Trends",
    addWatermark: "Add Watermark",
    includeRawData: "Include Raw Data Table",
    exportPreview: "Export Preview",
    preview: "Preview",
    exportNow: "Export Now",
    success: "Success!",
    exportSuccess: "Your media kit has been exported successfully.",
    dismiss: "Dismiss"
  },
  ur: {
    appName: "سوشل کٹ",
    dashboard: "ڈیش بورڈ",
    history: "تاریخ",
    templates: "ٹیمپلیٹس",
    settings: "ترتیبات",
    needHelp: "مدد چاہیے؟",
    getSupport: "سپورٹ حاصل کریں",
    mediaKitCreator: "میڈیا کٹ تخلیق کار",
    transformAnalytics: "اپنی تجزیات کو شاندار قابل اشتراک اثاثوں میں تبدیل کریں",
    dropFiles: "اپنی فائلیں یہاں چھوڑیں",
    uploadInstructions: "تجزیات نکالنے کے لیے اسکرین شاٹس، PDFs، یا اسپریڈشیٹس اپ لوڈ کریں",
    selectFiles: "فائلیں منتخب کریں",
    processingFiles: "فائلوں کی پروسیسنگ",
    extractedData: "نکالے گئے ڈیٹا کا جائزہ لیں",
    editAll: "سب میں ترمیم کریں",
    platform: "پلیٹ فارم",
    metric: "میٹرک",
    value: "قیمت",
    period: "مدت",
    confidence: "اعتماد",
    actions: "اقدامات",
    loading: "لوڈ ہو رہا ہے...",
    complete: "مکمل",
    error: "خرابی",
    remove: "ہٹا دیں",
    cancel: "منسوخ کریں",
    view: "دیکھیں",
    mediaKitDashboard: "آپ کا میڈیا کٹ ڈیش بورڈ",
    last30Days: "آخری 30 دن",
    brandColors: "برانڈ کے رنگ:",
    customize: "تخصیص",
    followers: "فالوورز",
    engagement: "مصروفیت کی شرح",
    impressions: "ماہانہ تاثرات",
    vsLastMonth: "پچھلے مہینے کے مقابلے میں",
    audienceGrowth: "سامعین کی نمو",
    contentPerformance: "مواد کی کارکردگی",
    platformBreakdown: "پلیٹ فارم کی تفصیل",
    exportOptions: "برآمد کے اختیارات",
    exportFormat: "برآمد کی شکل",
    pdfDocument: "پی ڈی ایف دستاویز",
    jpegImages: "جے پی ای جی تصاویر",
    interactiveHtml: "انٹرایکٹو ایچ ٹی ایم ایل",
    templateStyle: "ٹیمپلیٹ طرز",
    modern: "جدید",
    minimal: "کم از کم",
    vibrant: "متحرک",
    corporate: "کارپوریٹ",
    additionalOptions: "اضافی اختیارات",
    includeQrCodes: "QR کوڈز شامل کریں",
    includeGrowthTrends: "نمو کے رجحانات شامل کریں",
    addWatermark: "واٹر مارک شامل کریں",
    includeRawData: "خام ڈیٹا ٹیبل شامل کریں",
    exportPreview: "برآمد کا پیش منظر",
    preview: "پیش منظر",
    exportNow: "ابھی برآمد کریں",
    success: "کامیابی!",
    exportSuccess: "آپ کی میڈیا کٹ کامیابی سے برآمد کر دی گئی ہے۔",
    dismiss: "رد کریں"
  }
};

export const translate = (key: TranslationKey, language: "en" | "ur" = "en"): string => {
  return translations[language][key] || translations.en[key] || key;
};
