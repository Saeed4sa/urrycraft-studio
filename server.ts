import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize Gemini client if API key is present
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Endpoint: AI-Powered Universal Prompt Enhancer using Gemini 3.8 Flash
app.post('/api/enhance-prompt', async (req, res) => {
  try {
    const { userPrompt = '', style = '', lighting = '', camera = '', enableNsfw = false } = req.body;

    if (!ai) {
      // Fallback local prompt enricher if Gemini API key is not yet configured
      const enriched = [
        userPrompt || 'Breathtaking masterpiece concept art',
        style ? `${style} aesthetic` : '8k high resolution',
        lighting ? `lighting: ${lighting}` : 'volumetric cinematic lighting',
        camera ? `camera: ${camera}` : 'sharp focal plane',
        'masterpiece, ultra-detailed, sharp focus, professional color grading'
      ].filter(Boolean).join(', ');

      const negativePrompt = enableNsfw
        ? 'blurry, low quality, deformed anatomy, extra limbs, bad hands, artifacts'
        : 'nsfw, nude, explicit, blurry, low quality, deformed anatomy, extra limbs, bad hands, artifacts';

      return res.json({
        enhancedPrompt: enriched,
        negativePrompt,
        enhancerUsed: 'local-heuristic'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an expert prompt engineer for cutting-edge text-to-image models (FLUX, SDXL, Midjourney, Perchance).
Enhance the following prompt idea into an exceptional, production-grade image generation prompt:
- User Prompt / Subject: ${userPrompt || 'A stunning artistic creation'}
- Desired Style: ${style || 'Cinematic Photorealism or Concept Art'}
- Lighting: ${lighting || 'Cinematic studio illumination'}
- Camera/Framing: ${camera || 'Professional lens framing'}
- Content Filter Mode: ${enableNsfw ? 'Unrestricted / Mature allowed' : 'Strictly Safe (No NSFW, no gore)'}

Return a JSON object with:
- "enhancedPrompt": A descriptive, comma-separated art prompt with vivid textures, lighting conditions, atmosphere, depth, and aesthetic modifiers.
- "negativePrompt": Optimal negative prompt preventing common defects (deformed anatomy, distorted hands, blurry textures, compression artifacts, ${enableNsfw ? '' : 'nsfw, explicit, nude'}).
- "tagline": A 1-sentence catchy description of the scene.`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      enhancedPrompt: parsed.enhancedPrompt || userPrompt,
      negativePrompt: parsed.negativePrompt || 'bad anatomy, deformed, blurry, artifacts',
      tagline: parsed.tagline || 'AI Generated Image',
      enhancerUsed: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.error('Enhance prompt error:', error);
    return res.status(500).json({ error: error.message || 'Failed to enhance prompt' });
  }
});

// Endpoint: Perchance Generation Bridge
app.post('/api/generate', async (req, res) => {
  try {
    const {
      prompt,
      negativePrompt = '',
      style = 'Digital Art',
      seed = Math.floor(Math.random() * 9999999),
      aspectRatio = '1:1',
      enableNsfw = false,
      enginePreference = 'auto'
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let perchanceSuccess = false;
    let imageUrl = '';
    let engineUsed: 'perchance' | 'ai-fallback' = 'perchance';

    // Dimensions
    const width = aspectRatio === '16:9' ? 1024 : aspectRatio === '9:16' ? 576 : aspectRatio === '3:4' ? 768 : aspectRatio === '4:3' ? 1024 : 1024;
    const height = aspectRatio === '16:9' ? 576 : aspectRatio === '9:16' ? 1024 : aspectRatio === '3:4' ? 1024 : aspectRatio === '4:3' ? 768 : 1024;

    // Try Perchance direct API endpoint
    if (enginePreference !== 'ai-only') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        const perchanceUrl = `https://image-generation.perchance.org/api/generate?prompt=${encodeURIComponent(
          prompt
        )}&negativePrompt=${encodeURIComponent(
          negativePrompt
        )}&seed=${seed}&resolution=${width}x${height}&safe=${enableNsfw ? 'false' : 'true'}`;

        const resp = await fetch(perchanceUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://perchance.org/ai-text-to-image',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (resp.ok) {
          const contentType = resp.headers.get('content-type') || '';
          if (contentType.includes('image/')) {
            const buffer = await resp.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            imageUrl = `data:${contentType};base64,${base64}`;
            perchanceSuccess = true;
          } else {
            const data = await resp.json().catch(() => null);
            if (data?.url || data?.image || data?.imageUrl) {
              imageUrl = data.url || data.image || data.imageUrl;
              perchanceSuccess = true;
            }
          }
        }
      } catch (err) {
        perchanceSuccess = false;
      }
    }

    // High-resolution AI fallback
    if (!perchanceSuccess) {
      engineUsed = 'ai-fallback';
      // Direct live AI diffusion API
      imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        prompt
      )}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux${enableNsfw ? '&safe=false' : '&safe=true'}`;
    }

    return res.json({
      success: true,
      imageUrl,
      engineUsed,
      prompt,
      negativePrompt,
      style,
      seed,
      aspectRatio,
      enableNsfw,
      timestamp: Date.now(),
      perchanceStatus: perchanceSuccess ? 'connected' : 'fallback-active',
      perchanceUrl: `https://perchance.org/ai-text-to-image#${encodeURIComponent(prompt)}`
    });
  } catch (error: any) {
    console.error('Generate endpoint error:', error);
    return res.status(500).json({ error: error.message || 'Generation failed' });
  }
});

// Serve frontend in dev or prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`PixelStudio AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
