export interface FurryCharacterConfig {
  species: string;
  category: string;
  subspecies?: string;
  genderOrBuild: string;
  furColor: string;
  patternType: string;
  eyeColor: string;
  expression: string;
  clothing: string;
  accessories: string[];
  artStyle: string;
  lighting: string;
  background: string;
  aspectRatio: '1:1' | '3:4' | '4:3' | '16:9';
  customNotes: string;
  negativePrompt: string;
}

export interface GeneratedArtwork {
  id: string;
  imageUrl: string;
  prompt: string;
  negativePrompt: string;
  species: string;
  style: string;
  engineUsed: 'perchance' | 'ai-fallback';
  createdAt: number;
  isFavorite: boolean;
  aspectRatio: string;
  seed: number;
  configSnapshot?: FurryCharacterConfig;
}

export interface SpeciesOption {
  id: string;
  name: string;
  category: 'Canines' | 'Felines' | 'Mythical' | 'Cybernetic' | 'Small Mammals' | 'Scalies' | 'Avians';
  description: string;
  popularTraits: string[];
  defaultStyle: string;
}

export interface PresetArchetype {
  id: string;
  title: string;
  species: string;
  tagline: string;
  config: Partial<FurryCharacterConfig>;
  previewImage: string;
}
