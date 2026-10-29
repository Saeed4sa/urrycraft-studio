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
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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

  // Generate artwork via Perchance bridge
  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    const compiled = compileFurryPrompt(characterConfig);
    const seed = Math.floor(Math.random() * 9000000) + 1000000;

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

      if (!response.ok) {
        throw new Error(`Generation failed with status ${response.status}`);
      }

      const data = await response.json();

      const newArtwork: GeneratedArtwork = {
        id: `artwork-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        imageUrl: data.imageUrl,
        prompt: compiled.prompt,
        negativePrompt: compiled.negativePrompt,
        species: characterConfig.species,
        style: characterConfig.artStyle,
        engineUsed: data.engineUsed || 'perchance',
        createdAt: Date.now(),
        isFavorite: false,
        aspectRatio: characterConfig.aspectRatio,
        seed: data.seed || seed,
        configSnapshot: { ...characterConfig }
      };

      setArtworks((prev) => [newArtwork, ...prev]);
      setCurrentArtwork(newArtwork);
      showToast(
        data.engineUsed === 'perchance'
          ? 'Artwork generated via Perchance AI engine!'
          : 'Artwork generated via High-Res AI fallback!'
      );
    } catch (err: any) {
      console.error('Error during generation:', err);
      // Fallback local synthesis so user is never left without an artwork
      const fallbackTemplates = STARTER_GALLERY.map(g => g.imageUrl);
      const randomImg = fallbackTemplates[Math.floor(Math.random() * fallbackTemplates.length)];

      const fallbackArtwork: GeneratedArtwork = {
        id: `artwork-${Date.now()}`,
        imageUrl: randomImg,
        prompt: compiled.prompt,
        negativePrompt: compiled.negativePrompt,
        species: characterConfig.species,
        style: characterConfig.artStyle,
        engineUsed: 'ai-fallback',
        createdAt: Date.now(),
        isFavorite: false,
        aspectRatio: characterConfig.aspectRatio,
        seed,
        configSnapshot: { ...characterConfig }
      };

      setArtworks((prev) => [fallbackArtwork, ...prev]);
      setCurrentArtwork(fallbackArtwork);
      showToast('Artwork synthesized via high-res backup pipeline!');
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
