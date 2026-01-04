export interface ProcessedImage {
  originalData: string;
  processedData: string | null;
  mimeType: string;
}

export enum BackgroundOption {
  WHITE = 'white',
  TRANSPARENT = 'transparent',
  GREEN_SCREEN = 'green_screen',
  STUDIO = 'studio',
  CITY = 'city',
  NATURE = 'nature'
}

export interface ProcessingConfig {
  option: BackgroundOption;
  customPrompt?: string;
}