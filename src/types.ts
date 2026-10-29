export interface ImageGenerationConfig {
  prompt: string;
  negativePrompt: string;
  category: string;
  style: string;
  lighting: string;
  camera: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  enableNsfw: boolean;
  seed: number;
}

export interface GeneratedArtwork {
  id: string;
  imageUrl: string;
  prompt: string;
  negativePrompt: string;
  category: string;
  style: string;
  engineUsed: 'perchance' | 'ai-fallback';
  createdAt: number;
  isFavorite: boolean;
  aspectRatio: string;
  seed: number;
  isNsfw?: boolean;
  configSnapshot?: ImageGenerationConfig;
}

export interface PresetTemplate {
  id: string;
  title: string;
  tagline: string;
  previewImage: string;
  category: string;
  config: Partial<ImageGenerationConfig>;
}
