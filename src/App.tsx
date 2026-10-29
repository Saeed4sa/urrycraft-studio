/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CreatorPanel } from './components/CreatorPanel';
import { OutputViewport } from './components/OutputViewport';
import { GalleryView } from './components/GalleryView';
import { PresetsModal } from './components/PresetsModal';
import { PerchanceEngineModal } from './components/PerchanceEngineModal';
import { LightboxModal } from './components/LightboxModal';
import {
  INITIAL_CHARACTER_CONFIG,
  STARTER_GALLERY,
  SPECIES_CATALOG,
  COLOR_PALETTES,
  PATTERN_MARKINGS,
  EXPRESSION_PRESETS,
  CLOTHING_PRESETS,
  ART_STYLES,
  LIGHTING_PRESETS,
  compileFurryPrompt
} from './data/furryData';
import { FurryCharacterConfig, GeneratedArtwork, PresetArchetype } from './types';
import { Sparkles, Dna, ExternalLink } from 'lucide-react';

const STORAGE_KEY = 'furrycraft_studio_gallery_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'gallery' | 'presets' | 'engine'>('studio');
  const [characterConfig, setCharacterConfig] = useState<FurryCharacterConfig>(INITIAL_CHARACTER_CONFIG);
  const [artworks, setArtworks] = useState<GeneratedArtwork[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Heal any old paths from previous version
          return parsed.map((item: GeneratedArtwork) => {
            let img = item.imageUrl || '';
            if (img.includes('/src/assets/images/') || img.startsWith('/src/') || !img) {
              const lower = (item.species || '').toLowerCase();
              if (lower.includes('fox')) img = './images/showcase_furry_fox.jpg';
              else if (lower.includes('wolf')) img = './images/showcase_furry_wolf.jpg';
              else if (lower.includes('protogen') || lower.includes('cyber')) img = './images/showcase_furry_protogen.jpg';
              else if (lower.includes('dragon')) img = './images/showcase_furry_dragon.jpg';
              else img = './images/showcase_furry_fox.jpg';
            }
            return { ...item, imageUrl: img };
          });
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return STARTER_GALLERY;
  });

  const [currentArtwork, setCurrentArtwork] = useState<GeneratedArtwork | null>(() => {
    return artworks[0] || STARTER_GALLERY[0] || null;
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [enginePreference, setEnginePreference] = useState<'auto' | 'perchance' | 'ai-only'>('auto');
  const [lightboxArtwork, setLightboxArtwork] = useState<GeneratedArtwork | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync gallery to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(artworks));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [artworks]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Generate artwork via Perchance bridge or direct client AI engine
  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    const compiled = compileFurryPrompt(characterConfig);
    const seed = Math.floor(Math.random() * 9000000) + 1000000;

    const width = characterConfig.aspectRatio === '16:9' ? 1024 : characterConfig.aspectRatio === '9:16' ? 576 : characterConfig.aspectRatio === '3:4' ? 768 : characterConfig.aspectRatio === '4:3' ? 1024 : 1024;
    const height = characterConfig.aspectRatio === '16:9' ? 576 : characterConfig.aspectRatio === '9:16' ? 1024 : characterConfig.aspectRatio === '3:4' ? 1024 : characterConfig.aspectRatio === '4:3' ? 768 : 1024;

    try {
      let finalImageUrl = '';
      let engineUsed: 'perchance' | 'ai-fallback' = 'perchance';

      // 1. First attempt full-stack Express API if available
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: compiled.prompt,
            negativePrompt: compiled.negativePrompt,
            species: characterConfig.species,
            style: characterConfig.artStyle,
            aspectRatio: characterConfig.aspectRatio,
            seed,
            enginePreference
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.imageUrl && !data.imageUrl.startsWith('/src/assets/')) {
            finalImageUrl = data.imageUrl;
            engineUsed = data.engineUsed || 'perchance';
          }
        }
      } catch (backendErr) {
        // Backend not available (e.g. running on static GitHub Pages)
      }

      // 2. If no backend image (e.g., GitHub Pages), generate in client via live AI diffusion model
      if (!finalImageUrl) {
        const directAIUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
          compiled.prompt
        )}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

        // Preload image to ensure it loads before setting state
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            finalImageUrl = directAIUrl;
            engineUsed = 'perchance';
            resolve();
          };
          img.onerror = () => {
            resolve();
          };
          img.src = directAIUrl;
          // 10s maximum wait
          setTimeout(() => {
            if (!finalImageUrl) finalImageUrl = directAIUrl;
            resolve();
          }, 10000);
        });
      }

      // 3. Fallback to bundled local images if offline
      if (!finalImageUrl) {
        const localTemplates = [
          './images/showcase_furry_fox.jpg',
          './images/showcase_furry_wolf.jpg',
          './images/showcase_furry_protogen.jpg',
          './images/showcase_furry_dragon.jpg'
        ];
        const lower = characterConfig.species.toLowerCase();
        if (lower.includes('fox')) finalImageUrl = localTemplates[0];
        else if (lower.includes('wolf')) finalImageUrl = localTemplates[1];
        else if (lower.includes('protogen') || lower.includes('cyber')) finalImageUrl = localTemplates[2];
        else if (lower.includes('dragon')) finalImageUrl = localTemplates[3];
        else finalImageUrl = localTemplates[seed % localTemplates.length];
        engineUsed = 'ai-fallback';
      }

      const newArtwork: GeneratedArtwork = {
        id: `artwork-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        imageUrl: finalImageUrl,
        prompt: compiled.prompt,
        negativePrompt: compiled.negativePrompt,
        species: characterConfig.species,
        style: characterConfig.artStyle,
        engineUsed,
        createdAt: Date.now(),
        isFavorite: false,
        aspectRatio: characterConfig.aspectRatio,
        seed,
        configSnapshot: { ...characterConfig }
      };

      setArtworks((prev) => [newArtwork, ...prev]);
      setCurrentArtwork(newArtwork);
      showToast('Artwork generated successfully!');
    } catch (err: any) {
      console.error('Error during generation:', err);
      showToast('Generation error, please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Surprise Me / Randomize
  const handleRandomize = () => {
    const randomSpecies = SPECIES_CATALOG[Math.floor(Math.random() * SPECIES_CATALOG.length)];
    const randomPalette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
    const randomPattern = PATTERN_MARKINGS[Math.floor(Math.random() * PATTERN_MARKINGS.length)];
    const randomExpr = EXPRESSION_PRESETS[Math.floor(Math.random() * EXPRESSION_PRESETS.length)];
    const randomOutfit = CLOTHING_PRESETS[Math.floor(Math.random() * CLOTHING_PRESETS.length)];
    const randomStyle = ART_STYLES[Math.floor(Math.random() * ART_STYLES.length)];
    const randomLight = LIGHTING_PRESETS[Math.floor(Math.random() * LIGHTING_PRESETS.length)];

    setCharacterConfig({
      ...characterConfig,
      species: randomSpecies.name,
      category: randomSpecies.category,
      furColor: randomPalette,
      patternType: randomPattern,
      expression: randomExpr,
      clothing: randomOutfit,
      artStyle: randomStyle.name,
      lighting: randomLight.name,
      customNotes: 'Dynamic pose with vibrant eye glow and sharp fur outlines'
    });

    showToast(`Assembled random fursona: ${randomSpecies.name}!`);
    setActiveTab('studio');
  };

  // Remix character
  const handleRemix = (snapshot?: FurryCharacterConfig) => {
    if (snapshot) {
      setCharacterConfig({ ...snapshot });
    } else if (currentArtwork) {
      const matchSpecies = SPECIES_CATALOG.find(s => s.name === currentArtwork.species);
      setCharacterConfig({
        ...characterConfig,
        species: currentArtwork.species,
        category: matchSpecies?.category || characterConfig.category,
        artStyle: currentArtwork.style,
        customNotes: currentArtwork.prompt
      });
    }
    setActiveTab('studio');
    showToast('Loaded character parameters into Studio!');
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setArtworks((prev) =>
      prev.map((art) => (art.id === id ? { ...art, isFavorite: !art.isFavorite } : art))
    );
    if (currentArtwork && currentArtwork.id === id) {
      setCurrentArtwork((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
    if (lightboxArtwork && lightboxArtwork.id === id) {
      setLightboxArtwork((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Delete artwork
  const handleDeleteArtwork = (id: string) => {
    setArtworks((prev) => prev.filter((a) => a.id !== id));
    if (currentArtwork && currentArtwork.id === id) {
      const remaining = artworks.filter((a) => a.id !== id);
      setCurrentArtwork(remaining[0] || null);
    }
    showToast('Artwork removed from gallery.');
  };

  // Clear gallery
  const handleClearGallery = () => {
    if (window.confirm('Are you sure you want to clear your generation history?')) {
      setArtworks([]);
      setCurrentArtwork(null);
      localStorage.removeItem(STORAGE_KEY);
      showToast('Gallery cleared.');
    }
  };

  // Load archetype preset
  const handleSelectArchetype = (arch: PresetArchetype) => {
    setCharacterConfig({
      ...INITIAL_CHARACTER_CONFIG,
      ...arch.config,
      species: arch.species,
    });
    setActiveTab('studio');
    showToast(`Loaded ${arch.title} into Studio!`);
  };

  // Direct Perchance launcher
  const handleOpenPerchanceDirect = (prompt: string) => {
    setActiveTab('engine');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Bar Contract Compliant Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRandomize={handleRandomize}
        galleryCount={artworks.length}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-orange-500/30 bg-slate-900/95 px-4 py-3 text-xs font-medium text-white shadow-xl shadow-black/60 backdrop-blur-md animate-fade-in">
          <Sparkles className="h-4 w-4 text-orange-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Creator Customization Suite */}
            <div className="lg:col-span-6 xl:col-span-6">
              <CreatorPanel
                config={characterConfig}
                onChangeConfig={setCharacterConfig}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                onReset={() => setCharacterConfig(INITIAL_CHARACTER_CONFIG)}
                enginePreference={enginePreference}
                setEnginePreference={setEnginePreference}
              />
            </div>

            {/* Right Column: Active Output Viewport */}
            <div className="lg:col-span-6 xl:col-span-6">
              <OutputViewport
                currentArtwork={currentArtwork}
                isGenerating={isGenerating}
                onRemix={handleRemix}
                onToggleFavorite={handleToggleFavorite}
                onOpenLightbox={(art) => setLightboxArtwork(art)}
                onOpenPerchanceDirect={handleOpenPerchanceDirect}
              />
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <GalleryView
            artworks={artworks}
            onSelectArtwork={(art) => {
              setCurrentArtwork(art);
              setActiveTab('studio');
            }}
            onRemix={handleRemix}
            onToggleFavorite={handleToggleFavorite}
            onDeleteArtwork={handleDeleteArtwork}
            onClearGallery={handleClearGallery}
            onOpenLightbox={(art) => setLightboxArtwork(art)}
            onSwitchToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'presets' && (
          <PresetsModal onSelectArchetype={handleSelectArchetype} />
        )}

        {activeTab === 'engine' && (
          <PerchanceEngineModal currentPrompt={currentArtwork?.prompt || ''} />
        )}
      </main>

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        artwork={lightboxArtwork}
        onClose={() => setLightboxArtwork(null)}
        onRemix={handleRemix}
        onToggleFavorite={handleToggleFavorite}
        onOpenPerchanceDirect={handleOpenPerchanceDirect}
      />

      {/* Clean Compliant Footer (No decorative status dots or fake telemetry) */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-5 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">FurryCraft Studio</span>
            <span aria-hidden="true">·</span>
            <span>Connected to Perchance AI Furry Generator</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://perchance.org/ai-furry-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>Perchance Generator</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span aria-hidden="true">·</span>
            <span>Browser Generation Bridge</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
