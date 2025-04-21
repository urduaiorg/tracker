import Tesseract from "tesseract.js";

// Worker script for OCR processing
self.onmessage = async (e: MessageEvent) => {
  try {
    const { imageData, options } = e.data;
    const lang = options?.lang || "eng";
    
    const result = await Tesseract.recognize(
      imageData,
      lang,
      {
        logger: (m) => {
          if (m.status === "recognizing text") {
            // Report progress back to the main thread
            self.postMessage({
              status: "progress",
              progress: m.progress * 100 // Convert to percentage
            });
          }
        }
      }
    );
    
    // Send the complete recognition result back to the main thread
    self.postMessage({
      status: "complete",
      result: {
        text: result.data.text,
        confidence: result.data.confidence
      }
    });
    
  } catch (error) {
    // Handle and report errors
    self.postMessage({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error in OCR processing"
    });
  }
};

export {};
