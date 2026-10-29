import { GeneratedArtwork, ImageGenerationConfig, PresetTemplate } from '../types';

export const STYLE_CATEGORIES = [
  'All Styles',
  'Photorealism',
  'Anime & Manga',
  'Digital Art',
  '3D & CGI',
  'Painting & Fine Art',
  'Landscape & Architecture',
  'Sci-Fi & Cyberpunk'
];

export const ART_STYLES = [
  // Photorealism
  {
    id: 'photo-portrait',
    name: '85mm Cinematic Portrait',
    category: 'Photorealism',
    promptKey: 'photorealistic portrait, 85mm portrait lens, f/1.8 aperture, natural skin texture, studio quality lighting, shallow depth of field, 8k uhd'
  },
  {
    id: 'street-photo',
    name: 'Street Documentary 35mm',
    category: 'Photorealism',
    promptKey: 'documentary candid street photography, 35mm film grain, authentic moment, natural shadows, Leica camera aesthetic'
  },
  {
    id: 'editorial-fashion',
    name: 'High Fashion Editorial',
    category: 'Photorealism',
    promptKey: 'vogue editorial photoshoot, high fashion studio lighting, dramatic haute couture styling, sharp focus, magazine cover quality'
  },
  // Anime & Manga
  {
    id: 'anime-modern',
    name: 'Modern Anime / Ufotable',
    category: 'Anime & Manga',
    promptKey: 'vibrant modern anime aesthetic, ufotable animation style, crisp lineart, cel-shaded coloring, glowing highlights, dynamic cinematic frame'
  },
  {
    id: 'anime-ghibli',
    name: 'Studio Ghibli Aesthetic',
    category: 'Anime & Manga',
    promptKey: 'classic Studio Ghibli aesthetic, hand-painted anime background, nostalgic warm color palette, whimsical atmosphere, Hayao Miyazaki style'
  },
  {
    id: 'manga-ink',
    name: 'Dark Manga Ink Wash',
    category: 'Anime & Manga',
    promptKey: 'high contrast monochrome manga ink drawing, sharp crosshatching, dramatic screentones, expressive dynamic linework, Kentaro Miura style'
  },
  // 3D & CGI
  {
    id: 'octane-3d',
    name: '3D Octane Render',
    category: '3D & CGI',
    promptKey: 'photorealistic 3D render, octane render engine, raytracing, subsurface scattering, cinema4d, hyperdetailed textures, studio lighting'
  },
  {
    id: 'unreal-engine',
    name: 'Unreal Engine 5 Cinematic',
    category: '3D & CGI',
    promptKey: 'cinematic game still, Unreal Engine 5, Lumen global illumination, Nanite geometry, volumetric fog, dramatic cinematic camera'
  },
  {
    id: 'isometric-diorama',
    name: 'Isometric 3D Diorama',
    category: '3D & CGI',
    promptKey: 'cute miniature isometric diorama, tilt-shift lens, clay render with rich details, vibrant ambient occlusion, game asset concept'
  },
  // Digital & Fantasy
  {
    id: 'epic-fantasy',
    name: 'Epic High Fantasy Concept',
    category: 'Digital Art',
    promptKey: 'epic digital fantasy concept art, atmospheric matte painting, majestic scale, mystical magical particles, trending on ArtStation'
  },
  {
    id: 'sci-fi-concept',
    name: 'Sci-Fi Splash Concept',
    category: 'Sci-Fi & Cyberpunk',
    promptKey: 'masterpiece sci-fi concept art, futuristic technology, intricate mechanical details, cinematic wide angle, industrial design'
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon Noir',
    category: 'Sci-Fi & Cyberpunk',
    promptKey: 'rainy cyberpunk cityscape, neon cyan and magenta glow, dark reflections on wet asphalt, holographic billboards, atmospheric haze'
  },
  // Painting & Fine Art
  {
    id: 'oil-painting',
    name: 'Classical Oil on Canvas',
    category: 'Painting & Fine Art',
    promptKey: 'traditional oil painting on canvas, visible impasto brushstrokes, chiaroscuro dramatic lighting, rich museum fine art palette'
  },
  {
    id: 'watercolor-ethereal',
    name: 'Dreamy Watercolor Bleed',
    category: 'Painting & Fine Art',
    promptKey: 'ethereal watercolor painting, delicate fluid washes, organic wet-on-wet paint bleeds, fine ink outlines, soft pastel mood'
  },
  {
    id: 'ukiyo-e',
    name: 'Japanese Ukiyo-e Woodblock',
    category: 'Painting & Fine Art',
    promptKey: 'authentic Japanese ukiyo-e woodblock print style, Hokusai aesthetic, flat graphic shapes, stylized waves and nature, washi paper texture'
  },
  // Landscape & Architecture
  {
    id: 'landscape-scenic',
    name: 'National Geographic Scenic',
    category: 'Landscape & Architecture',
    promptKey: 'breathtaking landscape photography, national geographic award-winning capture, golden hour mountain vista, crisp clarity, hyper-detailed nature'
  },
  {
    id: 'futuristic-architecture',
    name: 'Futuristic Neo-Architecture',
    category: 'Landscape & Architecture',
    promptKey: 'architectural digest photography of futuristic parametric building, Zaha Hadid style curved white concrete and glass, lush vertical gardens'
  }
];

export const LIGHTING_OPTIONS = [
  { id: 'golden-hour', name: 'Golden Hour Sunset', promptKey: 'warm golden hour sunlight, low angle sun rays, soft atmospheric haze' },
  { id: 'cinematic-rim', name: 'Dramatic Rim Light', promptKey: 'intense silhouette rim lighting, dramatic backlight, rich deep shadows' },
  { id: 'studio-softbox', name: 'Clean Studio Softbox', promptKey: 'diffused studio softbox illumination, neutral commercial lighting, soft even fill' },
  { id: 'cyber-neon', name: 'Cyberpunk Neon Glow', promptKey: 'bioluminescent neon lighting, electric cyan and vivid magenta ambient glow' },
  { id: 'dark-noir', name: 'Moody Film Noir', promptKey: 'high contrast black and white film noir lighting, venetian blind cast shadows, moody smoke' },
  { id: 'ethereal-moon', name: 'Mystic Moonlight', promptKey: 'cool silvery nocturnal moonlight, stardust reflections, deep tranquil ambient tones' },
  { id: 'volumetric-sun', name: 'Volumetric God Rays', promptKey: 'dramatic volumetric god rays breaking through fog, dusty light beams, cinematic' }
];

export const CAMERA_OPTIONS = [
  { id: 'portrait-85mm', name: '85mm Portrait (F/1.8 Bokeh)', promptKey: 'shot on 85mm f/1.8 lens, shallow depth of field, creamy smooth background bokeh' },
  { id: 'wide-angle', name: '24mm Ultra Wide Angle', promptKey: 'shot on 24mm wide angle lens, expansive perspective, dramatic field of view' },
  { id: 'macro-detail', name: '100mm Macro Lens', promptKey: '100mm macro photography, extreme close-up detail, sharp focal plane, microscopic texture' },
  { id: 'aerial-drone', name: 'Aerial Drone Perspective', promptKey: 'top-down bird-eye aerial drone view, sweeping grand landscape perspective' },
  { id: 'vintage-35mm', name: '35mm Film Camera (Grain)', promptKey: 'shot on 35mm film, vintage Kodak Portra color tone, subtle analog grain' },
  { id: 'telephoto-zoom', name: '200mm Telephoto Compression', promptKey: 'shot on 200mm telephoto lens, compressed background perspective, razor sharp subject' }
];

export const PROMPT_IDEAS = [
  'A solitary astronaut discovering a glowing crystalline monolith on an alien desert world',
  'Hyperrealistic portrait of an elder watchmaker examining an intricate golden pocket watch with magnifying loupe',
  'Cozy autumnal coffee shop tucked inside an ancient bookstore during a gentle rainstorm',
  'Futuristic cybernetic samurai standing on a neon-lit bridge in Neo-Tokyo with cherry blossom petals falling',
  'Majestic celestial dragon wrapped around snow-peaked mountains under an aurora borealis night sky',
  'Minimalist mid-century modern living room overlooking a serene alpine lake at dawn'
];

export const INITIAL_STUDIO_CONFIG: ImageGenerationConfig = {
  prompt: 'Cinematic portrait of an elegant traveler standing under neon rain in Neo-Tokyo, wearing a sleek trench coat, reflective puddle lights',
  negativePrompt: 'blurry, deformed anatomy, extra limbs, bad hands, low resolution, distorted eyes, artifacts',
  category: 'All Styles',
  style: '85mm Cinematic Portrait',
  lighting: 'Cyberpunk Neon Glow',
  camera: '85mm Portrait (F/1.8 Bokeh)',
  aspectRatio: '1:1',
  enableNsfw: false,
  seed: 4829103
};

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'template-portrait',
    title: 'Studio Portrait Photography',
    tagline: 'Refined 85mm portraiture with natural skin textures and Rembrandt illumination.',
    previewImage: './images/showcase_portrait.jpg',
    category: 'Photorealism',
    config: {
      prompt: 'Photorealistic studio portrait of an elegant woman with natural skin texture, soft dramatic Rembrandt side lighting, neutral dark studio background, shot on 85mm lens, 8k commercial photography',
      style: '85mm Cinematic Portrait',
      lighting: 'Clean Studio Softbox',
      camera: '85mm Portrait (F/1.8 Bokeh)',
      aspectRatio: '1:1'
    }
  },
  {
    id: 'template-anime',
    title: 'Cyberpunk Anime Operative',
    tagline: 'Vibrant cel-shaded anime illustration with glowing holographic neon visors.',
    previewImage: './images/showcase_anime.jpg',
    category: 'Anime & Manga',
    config: {
      prompt: 'Vibrant cyberpunk anime aesthetic illustration of a female hacker with holographic neon visor, glowing city backdrop, crisp clean lineart, dynamic composition, high detail anime concept art',
      style: 'Modern Anime / Ufotable',
      lighting: 'Cyberpunk Neon Glow',
      camera: '35mm Film Camera (Grain)',
      aspectRatio: '1:1'
    }
  },
  {
    id: 'template-landscape',
    title: 'Celestial Floating Islands',
    tagline: 'Sweeping high fantasy matte painting with cascading waterfalls and ancient citadels.',
    previewImage: './images/showcase_landscape.jpg',
    category: 'Landscape & Architecture',
    config: {
      prompt: 'Epic high fantasy landscape with towering floating islands, cascading celestial waterfalls into the clouds, glowing ancient ruins, golden hour sunlight, lush vegetation, digital matte painting',
      style: 'Epic High Fantasy Concept',
      lighting: 'Golden Hour Sunset',
      camera: '24mm Ultra Wide Angle',
      aspectRatio: '1:1'
    }
  },
  {
    id: 'template-scifi',
    title: 'Heavy Assault Mecha Chassis',
    tagline: 'Intricate 3D CGI military mecha with raytraced hydraulic joints on a wet runway.',
    previewImage: './images/showcase_mecha.jpg',
    category: 'Sci-Fi & Cyberpunk',
    config: {
      prompt: 'Intricate futuristic mecha robot standing on a rain-slicked futuristic runway, detailed mechanical joints, neon warning lights, volumetric fog, octane render, unreal engine 5 aesthetic',
      style: 'Unreal Engine 5 Cinematic',
      lighting: 'Dramatic Rim Light',
      camera: '24mm Ultra Wide Angle',
      aspectRatio: '1:1'
    }
  }
];

export const STARTER_GALLERY: GeneratedArtwork[] = [
  {
    id: 'artwork-portrait-1',
    imageUrl: './images/showcase_portrait.jpg',
    prompt: 'Photorealistic studio portrait of an elegant woman with natural skin texture, soft dramatic Rembrandt side lighting, neutral dark studio background, shot on 85mm lens, 8k commercial photography',
    negativePrompt: 'blurry, deformed, bad skin, low quality, artifacts',
    category: 'Photorealism',
    style: '85mm Cinematic Portrait',
    engineUsed: 'perchance',
    createdAt: Date.now() - 1000 * 60 * 20,
    isFavorite: true,
    aspectRatio: '1:1',
    seed: 5829103,
    isNsfw: false
  },
  {
    id: 'artwork-anime-2',
    imageUrl: './images/showcase_anime.jpg',
    prompt: 'Vibrant cyberpunk anime aesthetic illustration of a female hacker with holographic neon visor, glowing city backdrop, crisp clean lineart, dynamic composition, high detail anime concept art',
    negativePrompt: 'deformed, lowres, distorted eyes, bad anatomy',
    category: 'Anime & Manga',
    style: 'Modern Anime / Ufotable',
    engineUsed: 'perchance',
    createdAt: Date.now() - 1000 * 60 * 60,
    isFavorite: true,
    aspectRatio: '1:1',
    seed: 8291038,
    isNsfw: false
  },
  {
    id: 'artwork-landscape-3',
    imageUrl: './images/showcase_landscape.jpg',
    prompt: 'Epic high fantasy landscape with towering floating islands, cascading celestial waterfalls into the clouds, glowing ancient ruins, golden hour sunlight, lush vegetation, digital matte painting',
    negativePrompt: 'blurry, oversaturated, lowres, bad render',
    category: 'Landscape & Architecture',
    style: 'Epic High Fantasy Concept',
    engineUsed: 'ai-fallback',
    createdAt: Date.now() - 1000 * 60 * 120,
    isFavorite: false,
    aspectRatio: '1:1',
    seed: 3918290,
    isNsfw: false
  },
  {
    id: 'artwork-mecha-4',
    imageUrl: './images/showcase_mecha.jpg',
    prompt: 'Intricate futuristic mecha robot standing on a rain-slicked futuristic runway, detailed mechanical joints, neon warning lights, volumetric fog, octane render, unreal engine 5 aesthetic',
    negativePrompt: 'blurry, bad proportions, distorted textures',
    category: 'Sci-Fi & Cyberpunk',
    style: 'Unreal Engine 5 Cinematic',
    engineUsed: 'perchance',
    createdAt: Date.now() - 1000 * 60 * 180,
    isFavorite: true,
    aspectRatio: '1:1',
    seed: 7192841,
    isNsfw: false
  }
];

export function compileStudioPrompt(config: ImageGenerationConfig): { prompt: string; negativePrompt: string } {
  const parts: string[] = [];

  // 1. User custom prompt (takes primary precedence)
  if (config.prompt?.trim()) {
    parts.push(config.prompt.trim());
  }

  // 2. Art style modifiers
  const styleObj = ART_STYLES.find(s => s.name === config.style);
  if (styleObj) {
    parts.push(styleObj.promptKey);
  }

  // 3. Lighting modifiers
  const lightObj = LIGHTING_OPTIONS.find(l => l.name === config.lighting);
  if (lightObj) {
    parts.push(lightObj.promptKey);
  }

  // 4. Camera modifiers
  const camObj = CAMERA_OPTIONS.find(c => c.name === config.camera);
  if (camObj) {
    parts.push(camObj.promptKey);
  }

  // Quality tokens
  parts.push('masterpiece', 'sharp focus', 'highly detailed');

  // Negative prompt calculation based on NSFW toggle
  let negative = config.negativePrompt || 'blurry, deformed, bad anatomy, bad hands, missing fingers, low resolution, artifacting';

  if (!config.enableNsfw) {
    // Strict safety negative prompt
    if (!negative.includes('nsfw')) {
      negative = `${negative}, nsfw, explicit, nude, naked, gore, violence, offensive`;
    }
  }

  return {
    prompt: parts.join(', '),
    negativePrompt: negative
  };
}
