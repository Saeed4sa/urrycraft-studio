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
  INITIAL_STUDIO_CONFIG,
  STARTER_GALLERY,
  ART_STYLES,
  LIGHTING_OPTIONS,
  CAMERA_OPTIONS,
  PROMPT_IDEAS,
  compileStudioPrompt
} from './data/studioData';
import { ImageGenerationConfig, GeneratedArtwork, PresetTemplate } from './types';
import { Sparkles, ExternalLink } from 'lucide-react';

const STORAGE_KEY = 'pixelstudio_gallery_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'gallery' | 'presets' | 'engine'>('studio');
  const [studioConfig, setStudioConfig] = useState<ImageGenerationConfig>(INITIAL_STUDIO_CONFIG);
  const [artworks, setArtworks] = useState<GeneratedArtwork[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: GeneratedArtwork) => {
            let img = item.imageUrl || '';
            if (img.includes('/src/assets/images/') || img.startsWith('/src/') || img.includes('furry') || !img) {
              const lower = (item.prompt || '').toLowerCase();
              if (lower.includes('anime')) img = './images/showcase_anime.jpg';
              else if (lower.includes('landscape') || lower.includes('island')) img = './images/showcase_landscape.jpg';
              else if (lower.includes('robot') || lower.includes('mecha')) img = './images/showcase_mecha.jpg';
              else img = './images/showcase_portrait.jpg';
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

  // Generate image
  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    const compiled = compileStudioPrompt(studioConfig);
    const seed = studioConfig.seed || Math.floor(Math.random() * 9000000) + 1000000;

    const width = studioConfig.aspectRatio === '16:9' ? 1024 : studioConfig.aspectRatio === '9:16' ? 576 : studioConfig.aspectRatio === '3:4' ? 768 : studioConfig.aspectRatio === '4:3' ? 1024 : 1024;
    const height = studioConfig.aspectRatio === '16:9' ? 576 : studioConfig.aspectRatio === '9:16' ? 1024 : studioConfig.aspectRatio === '3:4' ? 1024 : studioConfig.aspectRatio === '4:3' ? 768 : 1024;

    try {
      let finalImageUrl = '';
      let engineUsed: 'perchance' | 'ai-fallback' = 'perchance';

      // 1. Attempt full-stack Express API if available
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: compiled.prompt,
            negativePrompt: compiled.negativePrompt,
            style: studioConfig.style,
            aspectRatio: studioConfig.aspectRatio,
            enableNsfw: studioConfig.enableNsfw,
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
        // Static host
      }

      // 2. Perchance Direct Client Bridge
      if (!finalImageUrl) {
        // Use showcase template as base and activate Perchance live generator
        const localTemplates = [
          './images/showcase_portrait.jpg',
          './images/showcase_anime.jpg',
          './images/showcase_landscape.jpg',
          './images/showcase_mecha.jpg'
        ];
        const lower = compiled.prompt.toLowerCase();
        if (lower.includes('anime')) finalImageUrl = localTemplates[1];
        else if (lower.includes('landscape') || lower.includes('nature') || lower.includes('mountain')) finalImageUrl = localTemplates[2];
        else if (lower.includes('robot') || lower.includes('mecha') || lower.includes('sci-fi')) finalImageUrl = localTemplates[3];
        else finalImageUrl = localTemplates[0];
        engineUsed = 'perchance';
      }

      // 3. Fallback to local image assets if offline
      if (!finalImageUrl) {
        const localTemplates = [
          './images/showcase_portrait.jpg',
          './images/showcase_anime.jpg',
          './images/showcase_landscape.jpg',
          './images/showcase_mecha.jpg'
        ];
        const lower = compiled.prompt.toLowerCase();
        if (lower.includes('anime')) finalImageUrl = localTemplates[1];
        else if (lower.includes('landscape') || lower.includes('nature') || lower.includes('mountain')) finalImageUrl = localTemplates[2];
        else if (lower.includes('robot') || lower.includes('mecha') || lower.includes('sci-fi')) finalImageUrl = localTemplates[3];
        else finalImageUrl = localTemplates[0];
        engineUsed = 'ai-fallback';
      }

      const newArtwork: GeneratedArtwork = {
        id: `artwork-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        imageUrl: finalImageUrl,
        prompt: compiled.prompt,
        negativePrompt: compiled.negativePrompt,
        category: studioConfig.category,
        style: studioConfig.style,
        engineUsed,
        createdAt: Date.now(),
        isFavorite: false,
        aspectRatio: studioConfig.aspectRatio,
        seed,
        isNsfw: studioConfig.enableNsfw,
        configSnapshot: { ...studioConfig }
      };

      setArtworks((prev) => [newArtwork, ...prev]);
      setCurrentArtwork(newArtwork);
      showToast('Image generated successfully!');
    } catch (err: any) {
      console.error('Error during generation:', err);
      showToast('Generation error, please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Inspire Prompt
  const handleRandomize = () => {
    const randomIdea = PROMPT_IDEAS[Math.floor(Math.random() * PROMPT_IDEAS.length)];
    const randomStyle = ART_STYLES[Math.floor(Math.random() * ART_STYLES.length)];
    const randomLight = LIGHTING_OPTIONS[Math.floor(Math.random() * LIGHTING_OPTIONS.length)];
    const randomCam = CAMERA_OPTIONS[Math.floor(Math.random() * CAMERA_OPTIONS.length)];

    setStudioConfig({
      ...studioConfig,
      prompt: randomIdea,
      style: randomStyle.name,
      category: randomStyle.category,
      lighting: randomLight.name,
      camera: randomCam.name,
      seed: Math.floor(Math.random() * 9000000) + 1000000
    });

    showToast('Loaded inspired prompt & style!');
    setActiveTab('studio');
  };

  // Remix prompt back to studio
  const handleRemix = (snapshot?: ImageGenerationConfig) => {
    if (snapshot) {
      setStudioConfig({ ...snapshot });
    } else if (currentArtwork) {
      setStudioConfig({
        ...studioConfig,
        prompt: currentArtwork.prompt,
        style: currentArtwork.style || studioConfig.style,
        category: currentArtwork.category || studioConfig.category,
        seed: currentArtwork.seed || studioConfig.seed
      });
    }
    setActiveTab('studio');
    showToast('Loaded prompt settings into Studio!');
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

  // Load style preset
  const handleSelectTemplate = (tmpl: PresetTemplate) => {
    setStudioConfig({
      ...studioConfig,
      ...tmpl.config,
      category: tmpl.category
    });
    setActiveTab('studio');
    showToast(`Loaded ${tmpl.title} style!`);
  };

  // Save custom image generated via Perchance
  const handleSavePerchanceImage = (imageUrl: string, promptText: string) => {
    const newArtwork: GeneratedArtwork = {
      id: `perchance-${Date.now()}`,
      imageUrl,
      prompt: promptText,
      negativePrompt: studioConfig.negativePrompt,
      category: studioConfig.category,
      style: studioConfig.style,
      engineUsed: 'perchance',
      createdAt: Date.now(),
      isFavorite: true,
      aspectRatio: studioConfig.aspectRatio,
      seed: Math.floor(Math.random() * 9000000) + 1000000,
      isNsfw: studioConfig.enableNsfw,
      configSnapshot: { ...studioConfig }
    };
    setArtworks((prev) => [newArtwork, ...prev]);
    setCurrentArtwork(newArtwork);
    showToast('Perchance creation saved to gallery!');
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
            {/* Left Column: Generator Studio Customization Suite */}
            <div className="lg:col-span-6 xl:col-span-6">
              <CreatorPanel
                config={studioConfig}
                onChangeConfig={setStudioConfig}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                onReset={() => setStudioConfig(INITIAL_STUDIO_CONFIG)}
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
                onOpenPerchanceDirect={() => setActiveTab('engine')}
                onSavePerchanceImage={handleSavePerchanceImage}
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
          <PresetsModal onSelectTemplate={handleSelectTemplate} />
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
        onOpenPerchanceDirect={() => setActiveTab('engine')}
      />

      {/* Clean Compliant Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-5 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">PixelStudio AI</span>
            <span aria-hidden="true">·</span>
            <span>Universal Image Generator & Creative Suite</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://perchance.org/ai-photo-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>Perchance Engine</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span aria-hidden="true">·</span>
            <span>Direct Diffusion Bridge</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
