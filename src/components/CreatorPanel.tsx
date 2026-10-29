import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Sliders,
  Palette,
  SunMedium,
  Camera,
  Check,
  RotateCcw,
  RefreshCw,
  Flame,
  ShieldAlert,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { ImageGenerationConfig } from '../types';
import {
  STYLE_CATEGORIES,
  ART_STYLES,
  LIGHTING_OPTIONS,
  CAMERA_OPTIONS,
  PROMPT_IDEAS,
  compileStudioPrompt
} from '../data/studioData';

interface CreatorPanelProps {
  config: ImageGenerationConfig;
  onChangeConfig: (newConfig: ImageGenerationConfig) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onReset: () => void;
  enginePreference: 'perchance' | 'auto' | 'ai-only';
  setEnginePreference: (pref: 'perchance' | 'auto' | 'ai-only') => void;
}

export const CreatorPanel: React.FC<CreatorPanelProps> = ({
  config,
  onChangeConfig,
  onGenerate,
  isGenerating,
  onReset,
  enginePreference,
  setEnginePreference
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'styles' | 'lighting' | 'camera' | 'settings'>('styles');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Styles');
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [showNegative, setShowNegative] = useState<boolean>(false);
  const [promptToast, setPromptToast] = useState<string | null>(null);

  const compiled = compileStudioPrompt(config);

  const filteredStyles = selectedCategory === 'All Styles'
    ? ART_STYLES
    : ART_STYLES.filter(s => s.category === selectedCategory);

  const handleEnhanceWithAI = async () => {
    if (!config.prompt.trim()) {
      setPromptToast('Please type a prompt idea first!');
      setTimeout(() => setPromptToast(null), 3000);
      return;
    }
    setIsEnhancing(true);
    try {
      const resp = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: config.prompt,
          style: config.style,
          lighting: config.lighting,
          camera: config.camera,
          enableNsfw: config.enableNsfw
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.enhancedPrompt) {
          onChangeConfig({
            ...config,
            prompt: data.enhancedPrompt,
            negativePrompt: data.negativePrompt || config.negativePrompt
          });
          setPromptToast('Prompt enriched with rich artistic detail!');
          setTimeout(() => setPromptToast(null), 3500);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleRandomIdea = () => {
    const randomIdea = PROMPT_IDEAS[Math.floor(Math.random() * PROMPT_IDEAS.length)];
    onChangeConfig({
      ...config,
      prompt: randomIdea
    });
    setPromptToast('Inserted prompt idea!');
    setTimeout(() => setPromptToast(null), 2500);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">Image Generator Studio</h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
            <span>{config.style}</span>
            <span aria-hidden="true">·</span>
            <span>{config.aspectRatio}</span>
            <span aria-hidden="true">·</span>
            <span className={config.enableNsfw ? 'text-amber-400 font-medium' : 'text-emerald-400'}>
              {config.enableNsfw ? 'NSFW Allowed' : 'Safe Mode'}
            </span>
          </div>
        </div>

        <button
          onClick={onReset}
          title="Reset to default settings"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Prominent Custom Prompt Input ("i want to add me own prompts too") */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Wand2 className="h-3.5 w-3.5 text-orange-400" />
            <span>Your Custom Prompt</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomIdea}
              className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              Try Idea
            </button>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <button
              onClick={handleEnhanceWithAI}
              disabled={isEnhancing}
              className="flex items-center gap-1 text-[11px] font-medium text-orange-400 hover:text-orange-300 transition-colors disabled:opacity-50"
            >
              {isEnhancing ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              <span>{isEnhancing ? 'Enhancing...' : 'AI Enhance'}</span>
            </button>
          </div>
        </div>

        <textarea
          rows={3}
          value={config.prompt}
          onChange={(e) => onChangeConfig({ ...config, prompt: e.target.value })}
          placeholder="Describe any scene, character, object, portrait, or landscape you want to generate in full detail..."
          className="w-full rounded-xl bg-slate-950 border border-slate-800/90 p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 font-sans leading-relaxed transition-colors selection:bg-orange-500/30"
        />

        {promptToast && (
          <div className="text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2.5 py-1 rounded-md animate-fade-in">
            {promptToast}
          </div>
        )}
      </div>

      {/* NSFW Enable / Disable Toggle Strip */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4">
        <div className="flex items-center gap-2.5">
          {config.enableNsfw ? (
            <ShieldAlert className="h-4 w-4 text-amber-400" />
          ) : (
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          )}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <span>NSFW Content Filter</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${config.enableNsfw ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                {config.enableNsfw ? 'UNRESTRICTED' : 'SAFE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {config.enableNsfw
                ? 'NSFW filter disabled. Mature, artistic, and unrestricted generation enabled.'
                : 'NSFW filter enabled. Explicit and mature content blocked from prompt outputs.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onChangeConfig({ ...config, enableNsfw: !config.enableNsfw })}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            config.enableNsfw ? 'bg-amber-500' : 'bg-slate-700'
          }`}
          role="switch"
          aria-checked={config.enableNsfw}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              config.enableNsfw ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Main Subtabs for Modifiers */}
      <div className="flex items-center gap-1 p-1 bg-slate-950/70 rounded-xl mb-4 border border-slate-800/70">
        <button
          onClick={() => setActiveSubTab('styles')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'styles'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          <span>Art Styles</span>
        </button>

        <button
          onClick={() => setActiveSubTab('lighting')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'lighting'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <SunMedium className="h-3.5 w-3.5" />
          <span>Lighting</span>
        </button>

        <button
          onClick={() => setActiveSubTab('camera')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'camera'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Camera className="h-3.5 w-3.5" />
          <span>Camera & Lens</span>
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'settings'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Ratio & Seed</span>
        </button>
      </div>

      {/* Subtab 1: Art Styles Across All Genres */}
      {activeSubTab === 'styles' && (
        <div className="space-y-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {STYLE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-white font-medium border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Styles Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {filteredStyles.map((style) => {
              const isSelected = config.style === style.name;
              return (
                <button
                  key={style.id}
                  onClick={() => onChangeConfig({ ...config, style: style.name })}
                  className={`flex flex-col text-left p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-orange-500/60 bg-orange-500/10 shadow-sm'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-100">{style.name}</span>
                    {isSelected && <Check className="h-3 w-3 text-orange-400" />}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 line-clamp-1 leading-tight">
                    {style.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 2: Lighting & Atmosphere */}
      {activeSubTab === 'lighting' && (
        <div className="space-y-3">
          <label className="block text-xs font-medium text-slate-300">Atmospheric Illumination</label>
          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {LIGHTING_OPTIONS.map((light) => {
              const isSelected = config.lighting === light.name;
              return (
                <button
                  key={light.id}
                  onClick={() => onChangeConfig({ ...config, lighting: light.name })}
                  className={`flex items-center justify-between text-left p-2.5 rounded-xl border text-xs transition-colors ${
                    isSelected
                      ? 'border-orange-500/60 bg-orange-500/10 text-orange-300 font-semibold'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="truncate">{light.name}</span>
                  {isSelected && <Check className="h-3 w-3 text-orange-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 3: Camera & Lens */}
      {activeSubTab === 'camera' && (
        <div className="space-y-3">
          <label className="block text-xs font-medium text-slate-300">Camera Lens & Perspective</label>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {CAMERA_OPTIONS.map((cam) => {
              const isSelected = config.camera === cam.name;
              return (
                <button
                  key={cam.id}
                  onClick={() => onChangeConfig({ ...config, camera: cam.name })}
                  className={`w-full flex items-center justify-between text-left p-2.5 rounded-xl border text-xs transition-colors ${
                    isSelected
                      ? 'border-orange-500/60 bg-orange-500/10 text-orange-300 font-semibold'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="truncate">{cam.name}</span>
                  {isSelected && <Check className="h-3 w-3 text-orange-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 4: Aspect Ratio & Seed */}
      {activeSubTab === 'settings' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Aspect Ratio</label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['1:1', '16:9', '9:16', '4:3', '3:4'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => onChangeConfig({ ...config, aspectRatio: ratio })}
                  className={`py-2 rounded-lg border text-xs font-mono tabular-nums transition-colors ${
                    config.aspectRatio === ratio
                      ? 'border-orange-500/60 bg-orange-500/10 text-orange-300 font-medium'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Random Seed</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={config.seed}
                onChange={(e) => onChangeConfig({ ...config, seed: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 font-mono tabular-nums focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={() => onChangeConfig({ ...config, seed: Math.floor(Math.random() * 9000000) + 1000000 })}
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
              >
                Randomize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Negative Prompt & Filters */}
      <div className="mt-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setShowNegative(!showNegative)}
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>{showNegative ? '− Hide Negative Prompt' : '+ Negative Prompt Filters'}</span>
          </button>

          <span className="text-[11px] text-slate-500 font-mono">
            {config.enableNsfw ? 'Uncensored Mode' : 'Safe Filter Active'}
          </span>
        </div>

        {showNegative && (
          <textarea
            rows={2}
            value={config.negativePrompt}
            onChange={(e) => onChangeConfig({ ...config, negativePrompt: e.target.value })}
            placeholder="Things to avoid (e.g., blurry, distorted hands, extra limbs)..."
            className="w-full rounded-lg bg-slate-950 border border-slate-800/80 p-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-orange-500 leading-relaxed"
          />
        )}
      </div>

      {/* Engine Switcher & Generation Trigger */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Engine Pipeline:</span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setEnginePreference('auto')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                enginePreference === 'auto'
                  ? 'bg-slate-800 text-orange-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Perchance + AI
            </button>
            <button
              onClick={() => setEnginePreference('perchance')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                enginePreference === 'perchance'
                  ? 'bg-slate-800 text-orange-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Perchance Direct
            </button>
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-orange-500/20 hover:from-orange-400 hover:to-amber-400 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Generating Image...</span>
            </>
          ) : (
            <>
              <Flame className="h-4 w-4" />
              <span>Generate Image</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
