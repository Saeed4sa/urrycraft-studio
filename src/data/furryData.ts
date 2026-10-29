import { SpeciesOption, PresetArchetype, GeneratedArtwork, FurryCharacterConfig } from '../types';

export const SPECIES_CATALOG: SpeciesOption[] = [
  // Canines
  {
    id: 'arctic-fox',
    name: 'Arctic Fox',
    category: 'Canines',
    description: 'Fluffy white-cyan coat with large alert ears and brush tail',
    popularTraits: ['Fluffy tail', 'Dual-tone fur', 'Ear tips'],
    defaultStyle: 'Anime Cel-Shaded'
  },
  {
    id: 'timber-wolf',
    name: 'Timber Wolf',
    category: 'Canines',
    description: 'Majestic muscular canine with textured grey-black coat and intense eyes',
    popularTraits: ['Mane scruff', 'Battle scars', 'Dense coat'],
    defaultStyle: 'Painterly Digital Oils'
  },
  {
    id: 'red-fox',
    name: 'Red Fox',
    category: 'Canines',
    description: 'Classic auburn fur with white chest and black stockings',
    popularTraits: ['Bushy white-tipped tail', 'Slender build', 'Smirk'],
    defaultStyle: 'Digital Concept Art'
  },
  {
    id: 'siberian-husky',
    name: 'Siberian Husky',
    category: 'Canines',
    description: 'Striking mask markings with heterochromia blue-brown eyes',
    popularTraits: ['Face mask pattern', 'Curled tail', 'High energy'],
    defaultStyle: 'Anime Cel-Shaded'
  },
  // Felines
  {
    id: 'snow-leopard',
    name: 'Snow Leopard',
    category: 'Felines',
    description: 'Extra thick tail, smoke-grey fur with charcoal rosettes',
    popularTraits: ['Giant plush tail', 'Rosette spots', 'Tufted ears'],
    defaultStyle: '3D Digital Render'
  },
  {
    id: 'bengal-tiger',
    name: 'Bengal Tiger',
    category: 'Felines',
    description: 'Vibrant amber coat with bold black tiger stripes',
    popularTraits: ['Fierce stripes', 'Muscular build', 'Whiskers'],
    defaultStyle: 'High-Fantasy Splash'
  },
  {
    id: 'domestic-cat',
    name: 'Calico Cat',
    category: 'Felines',
    description: 'Playful tricolor feline with expressive whiskers and agile stance',
    popularTraits: ['Tricolor patches', 'Bell collar', 'Soft paws'],
    defaultStyle: 'Anime Cel-Shaded'
  },
  // Cybernetic
  {
    id: 'protogen',
    name: 'Protogen',
    category: 'Cybernetic',
    description: 'Cyborg anthro with curved digital visor displaying LED emote faces',
    popularTraits: ['LED visor emote', 'Armor chassis', 'Mechanical tail'],
    defaultStyle: '3D Digital Render'
  },
  {
    id: 'synx',
    name: 'Cybernetic Hound',
    category: 'Cybernetic',
    description: 'Futuristic mechanical canine with glowing optic sensors and wire harnesses',
    popularTraits: ['Chrome plating', 'Optic implants', 'Power conduits'],
    defaultStyle: 'Cyberpunk Splash'
  },
  // Mythical
  {
    id: 'western-dragon',
    name: 'Western Dragon',
    category: 'Mythical',
    description: 'Noble horned scalie with leathery bat wings and iridescent scales',
    popularTraits: ['Horned crest', 'Leather wings', 'Underbelly plates'],
    defaultStyle: 'High-Fantasy Splash'
  },
  {
    id: 'eastern-dragon',
    name: 'Eastern Celestial Dragon',
    category: 'Mythical',
    description: 'Serpentine dragon with flowing antler horns, whisker tendrils, and mane',
    popularTraits: ['Floating whiskers', 'Antler crest', 'Silken mane'],
    defaultStyle: 'Classic Watercolor'
  },
  {
    id: 'gryphon',
    name: 'Gryphon',
    category: 'Mythical',
    description: 'Majestic eagle head and feathered wings atop a powerful lion body',
    popularTraits: ['Hooked beak', 'Large feathered wings', 'Lion paws'],
    defaultStyle: 'Painterly Digital Oils'
  },
  // Small Mammals
  {
    id: 'river-otter',
    name: 'River Otter',
    category: 'Small Mammals',
    description: 'Sleek waterproof brown coat, webbed paws, and playful buoyant nature',
    popularTraits: ['Whiskered muzzle', 'Tapered tail', 'Goggles'],
    defaultStyle: 'Anime Cel-Shaded'
  },
  {
    id: 'red-panda',
    name: 'Red Panda',
    category: 'Small Mammals',
    description: 'Rust-red coat, white brow marks, and fluffy striped ringed tail',
    popularTraits: ['Ringed tail', 'Tear stripes', 'Round ears'],
    defaultStyle: 'Digital Concept Art'
  },
  // Scalies
  {
    id: 'scalie-lizard',
    name: 'Monitor Lizard',
    category: 'Scalies',
    description: 'Desert reptilian with textured beaded scales, frilled crest, and fork tongue',
    popularTraits: ['Dorsal spine frill', 'Forked tongue', 'Desert leathers'],
    defaultStyle: 'Digital Concept Art'
  }
];

export const ART_STYLES = [
  { id: 'anime-cel', name: 'Modern Anime', promptKey: 'vibrant anime aesthetic, clean lineart, cel-shaded coloring, crisp highlights, ufotable style' },
  { id: 'digital-concept', name: 'Digital Concept Art', promptKey: 'masterpiece digital concept art, fur texture details, studio character portrait, 8k resolution, fur affinity style' },
  { id: 'painterly-oil', name: 'Painterly Oil Painting', promptKey: 'rich textured brush strokes, traditional oil on canvas aesthetic, warm dynamic lighting, chiaroscuro' },
  { id: '3d-octane', name: '3D Octane Render', promptKey: 'photorealistic 3D digital render, octane render, soft raytraced reflections, subsurface scattering, cinema4d' },
  { id: 'retro-90s', name: 'Classic 90s Cartoon', promptKey: 'retro 90s saturday morning animation, dynamic action poses, expressive hand-drawn animation frames' },
  { id: 'watercolor', name: 'Ethereal Watercolor', promptKey: 'soft watercolor bleeds, organic wet-on-wet paint edges, delicate ink linework, dreamy mood' },
  { id: 'cyberpunk', name: 'Cyberpunk Splash', promptKey: 'futuristic neon lighting, chromatic aberration, holographic reflections, dark gritty sci-fi backdrop' }
];

export const LIGHTING_PRESETS = [
  { id: 'rim-light', name: 'Dramatic Rim Light', promptKey: 'strong atmospheric rim lighting, back-lit silhouette edge, deep contrast shadows' },
  { id: 'cyber-neon', name: 'Cyber Neon Glow', promptKey: 'bioluminescent cyan and magenta neon glow, dark rainy reflections' },
  { id: 'golden-hour', name: 'Golden Hour Sunset', promptKey: 'warm golden hour sun rays, soft atmospheric haze, glowing fur highlights' },
  { id: 'ethereal-moon', name: 'Mystic Moonlight', promptKey: 'cool silvery moonlight, star dust specks, soft nocturnal ambient shadows' },
  { id: 'studio-softbox', name: 'Studio Softbox', promptKey: 'clean commercial character portrait lighting, neutral diffused illumination, no harsh shadows' }
];

export const COLOR_PALETTES = [
  'Silver & Electric Cyan',
  'Slate Grey & Obsidian',
  'Rust Orange & Cream',
  'Deep Midnight & Gold',
  'Pastel Lilac & Mint',
  'Charcoal with Glowing Bioluminescence',
  'Pure Snow White & Rose Gold',
  'Forest Moss & Hazelnut'
];

export const PATTERN_MARKINGS = [
  'Solid with Underbelly Tone',
  'Bengal Tiger Stripes',
  'Snow Leopard Rosettes',
  'Cybernetic Geometric Lines',
  'Glowing Rune Inscriptions',
  'Socks and Muzzle Mask',
  'Spotted Freckle Clusters',
  'Smooth Gradient Fade'
];

export const EXPRESSION_PRESETS = [
  'Confident Smirk',
  'Friendly Welcoming Smile',
  'Fierce Battle Scowl',
  'Curious Tilted Head',
  'Stoic Dignified Stare',
  'Playful Cheeky Wink',
  'Dreamy Serene Gaze',
  'Shy Flustered Blush'
];

export const CLOTHING_PRESETS = [
  'High-Tech Cyberpunk Hoodie with Straps',
  'Intricate Fantasy Leather Pauldrons & Armor',
  'Celestial Mage Robes with Gold Trim',
  'Cozy Knitted Wool Oversized Sweater',
  'Steampunk Aviator Leather Vest with Goggles',
  'Tactical Stealth Recon Vest with Harness',
  'Formal Tailored Waistcoat and Tie',
  'Traditional Decorated Kimono Haori',
  'No Clothing (Full Natural Fur & Markings)'
];

export const ACCESSORY_OPTIONS = [
  'Large Wireless DJ Headphones',
  'Glowing Visor / Monocle',
  'Ornate Horn Piercings & Rings',
  'Crystal Amulet Necklace',
  'Fingerless Leather Gloves',
  'Leather Bandages & Wraps',
  'Feathered Ear Tufts',
  'Mechanical Shoulder Familiar',
  'Back-Slung Heavy Greatsword',
  'Hovering Spell Tome'
];

export const INITIAL_CHARACTER_CONFIG: FurryCharacterConfig = {
  species: 'Arctic Fox',
  category: 'Canines',
  genderOrBuild: 'Agile & Slender',
  furColor: 'Silver & Electric Cyan',
  patternType: 'Cybernetic Geometric Lines',
  eyeColor: 'Amber Gold',
  expression: 'Confident Smirk',
  clothing: 'High-Tech Cyberpunk Hoodie with Straps',
  accessories: ['Large Wireless DJ Headphones', 'Fingerless Leather Gloves'],
  artStyle: 'Modern Anime',
  lighting: 'Cyber Neon Glow',
  background: 'Futuristic Neo-Tokyo Rooftop',
  aspectRatio: '1:1',
  customNotes: 'Sharp cybernetic markings, detailed fluffy ears and bushy tail',
  negativePrompt: 'deformed anatomy, bad paws, extra fingers, distorted eyes, blurry, low resolution, artifacting, human hands'
};

export const PRESET_ARCHETYPES: PresetArchetype[] = [
  {
    id: 'archetype-cyber-fox',
    title: 'Unit-07 Cyber Vulpine',
    species: 'Arctic Fox',
    tagline: 'High-tech courier equipped with cyberware and neon street gear.',
    previewImage: './images/showcase_furry_fox.jpg',
    config: {
      species: 'Arctic Fox',
      category: 'Canines',
      genderOrBuild: 'Agile & Athletic',
      furColor: 'Silver & Electric Cyan',
      patternType: 'Cybernetic Geometric Lines',
      eyeColor: 'Amber Gold',
      expression: 'Confident Smirk',
      clothing: 'High-Tech Cyberpunk Hoodie with Straps',
      accessories: ['Large Wireless DJ Headphones', 'Fingerless Leather Gloves'],
      artStyle: 'Modern Anime',
      lighting: 'Cyber Neon Glow',
      background: 'Futuristic Neo-Tokyo Rooftop'
    }
  },
  {
    id: 'archetype-wolf-warrior',
    title: 'Northern Thane Fenrir',
    species: 'Timber Wolf',
    tagline: 'Venerated warrior of the glacial pines clad in carved leather armor.',
    previewImage: './images/showcase_furry_wolf.jpg',
    config: {
      species: 'Timber Wolf',
      category: 'Canines',
      genderOrBuild: 'Broad & Muscular',
      furColor: 'Slate Grey & Obsidian',
      patternType: 'Solid with Underbelly Tone',
      eyeColor: 'Intense Amber',
      expression: 'Stoic Dignified Stare',
      clothing: 'Intricate Fantasy Leather Pauldrons & Armor',
      accessories: ['Back-Slung Heavy Greatsword', 'Leather Bandages & Wraps'],
      artStyle: 'Painterly Oil Painting',
      lighting: 'Dramatic Rim Light',
      background: 'Snowbound Pine Forest Summit'
    }
  },
  {
    id: 'archetype-protogen-recon',
    title: 'Drift-9 Tactical Protogen',
    species: 'Protogen',
    tagline: 'Sleek synthetic operative navigating neon rain and digital alleyways.',
    previewImage: './images/showcase_furry_protogen.jpg',
    config: {
      species: 'Protogen',
      category: 'Cybernetic',
      genderOrBuild: 'Sleek Bipedal Chassis',
      furColor: 'Charcoal with Glowing Bioluminescence',
      patternType: 'Cybernetic Geometric Lines',
      eyeColor: 'Cyan LED Digital Emote',
      expression: 'Curious Tilted Head',
      clothing: 'Tactical Stealth Recon Vest with Harness',
      accessories: ['Glowing Visor / Monocle', 'Mechanical Shoulder Familiar'],
      artStyle: '3D Octane Render',
      lighting: 'Cyber Neon Glow',
      background: 'Rain-soaked Cyber City Underpass'
    }
  },
  {
    id: 'archetype-celestial-dragon',
    title: 'Grand Archivist Kaelen',
    species: 'Western Dragon',
    tagline: 'Ancient celestial scholar unravelling cosmic grimoires by candlelight.',
    previewImage: './images/showcase_furry_dragon.jpg',
    config: {
      species: 'Western Dragon',
      category: 'Mythical',
      genderOrBuild: 'Tall & Regal',
      furColor: 'Deep Midnight & Gold',
      patternType: 'Glowing Rune Inscriptions',
      eyeColor: 'Molten Gold',
      expression: 'Dreamy Serene Gaze',
      clothing: 'Celestial Mage Robes with Gold Trim',
      accessories: ['Hovering Spell Tome', 'Crystal Amulet Necklace'],
      artStyle: 'Digital Concept Art',
      lighting: 'Mystic Moonlight',
      background: 'Towering Astral Library with Stained Glass'
    }
  }
];

export const STARTER_GALLERY: GeneratedArtwork[] = [
  {
    id: 'artwork-1',
    imageUrl: './images/showcase_furry_fox.jpg',
    prompt: 'Anthropomorphic arctic fox character with silver-white and cyan fur, expressive amber eyes, wearing a techwear hoodie, digital concept art, vibrant cel-shaded illustration, character portrait, detailed fur texture, soft rim lighting, clean studio background',
    negativePrompt: 'deformed anatomy, bad paws, blurry, poorly drawn hands, disfigured, mutated, low quality',
    species: 'Arctic Fox',
    style: 'Modern Anime',
    engineUsed: 'perchance',
    createdAt: Date.now() - 1000 * 60 * 35,
    isFavorite: true,
    aspectRatio: '1:1',
    seed: 4829103
  },
  {
    id: 'artwork-2',
    imageUrl: './images/showcase_furry_wolf.jpg',
    prompt: 'Anthropomorphic timber wolf warrior with slate grey fur, amber eyes, intricate fantasy leather shoulder pauldron, painterly digital art style, dignified heroic expression, dynamic atmospheric lighting, sharp details',
    negativePrompt: 'deformed, distorted, extra limbs, bad anatomy, artifacts, lowres',
    species: 'Timber Wolf',
    style: 'Painterly Oil Painting',
    engineUsed: 'perchance',
    createdAt: Date.now() - 1000 * 60 * 85,
    isFavorite: true,
    aspectRatio: '1:1',
    seed: 9283712
  },
  {
    id: 'artwork-3',
    imageUrl: './images/showcase_furry_protogen.jpg',
    prompt: 'Anthropomorphic protogen cyborg character with dark metallic visor displaying glowing cyan LED expression, fluffy black and turquoise fur, futuristic cyber armor, soft neon reflections, 3D digital render, sharp focus',
    negativePrompt: 'blurry, bad proportions, distorted visor, glitch, low quality',
    species: 'Protogen',
    style: '3D Octane Render',
    engineUsed: 'ai-fallback',
    createdAt: Date.now() - 1000 * 60 * 140,
    isFavorite: false,
    aspectRatio: '1:1',
    seed: 6182901
  },
  {
    id: 'artwork-4',
    imageUrl: './images/showcase_furry_dragon.jpg',
    prompt: 'Anthropomorphic dragon scholar character with iridescent emerald and golden scales, horned crest, dressed in an ornate celestial robe, magical spark illumination, fantasy digital painting, high resolution character portrait',
    negativePrompt: 'bad anatomy, human hands, extra eyes, mutated scales, blurry',
    species: 'Western Dragon',
    style: 'Digital Concept Art',
    engineUsed: 'perchance',
    createdAt: Date.now() - 1000 * 60 * 210,
    isFavorite: true,
    aspectRatio: '1:1',
    seed: 3918204
  }
];

export function compileFurryPrompt(config: FurryCharacterConfig): { prompt: string; negativePrompt: string } {
  const parts: string[] = [];

  // Core subject
  parts.push(`Anthropomorphic ${config.species}`);
  if (config.genderOrBuild) parts.push(`${config.genderOrBuild.toLowerCase()} build`);

  // Anatomy & Fur
  if (config.furColor) parts.push(`${config.furColor.toLowerCase()} fur`);
  if (config.patternType && config.patternType !== 'Solid with Underbelly Tone') {
    parts.push(`pattern: ${config.patternType.toLowerCase()}`);
  }
  if (config.eyeColor) parts.push(`striking ${config.eyeColor.toLowerCase()} eyes`);
  if (config.expression) parts.push(`expression: ${config.expression.toLowerCase()}`);

  // Attire & Accessories
  if (config.clothing && config.clothing !== 'No Clothing (Full Natural Fur & Markings)') {
    parts.push(`wearing ${config.clothing}`);
  }
  if (config.accessories && config.accessories.length > 0) {
    parts.push(`accessories: ${config.accessories.join(', ')}`);
  }

  // Background environment
  if (config.background) parts.push(`background: ${config.background}`);

  // Art style & rendering
  const styleObj = ART_STYLES.find(s => s.name === config.artStyle);
  if (styleObj) {
    parts.push(styleObj.promptKey);
  } else {
    parts.push('masterpiece digital concept art, furry character portrait');
  }

  // Lighting
  const lightObj = LIGHTING_PRESETS.find(l => l.name === config.lighting);
  if (lightObj) {
    parts.push(lightObj.promptKey);
  }

  // User custom notes
  if (config.customNotes?.trim()) {
    parts.push(config.customNotes.trim());
  }

  // General quality anchors
  parts.push('high detail fur texture', 'character portrait', 'sharp focus', 'trending on e621 and artstation');

  return {
    prompt: parts.join(', '),
    negativePrompt: config.negativePrompt || 'deformed anatomy, bad paws, extra limbs, extra fingers, distorted eyes, blurry, low resolution, artifacting, human hands'
  };
}
