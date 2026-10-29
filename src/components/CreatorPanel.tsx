import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Sliders,
  Palette,
  Shirt,
  SunMedium,
  Check,
  RotateCcw,
  RefreshCw,
  Flame
} from 'lucide-react';
import { FurryCharacterConfig } from '../types';
import {
  SPECIES_CATALOG,
  ART_STYLES,
  LIGHTING_PRESETS,
  COLOR_PALETTES,
  PATTERN_MARKINGS,
  EXPRESSION_PRESETS,
  CLOTHING_PRESETS,
  ACCESSORY_OPTIONS,
  compileFurryPrompt
} from '../data/furryData';

interface CreatorPanelProps {
  config: FurryCharacterConfig;
  onChangeConfig: (newConfig: FurryCharacterConfig) => void;
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
  const [activeSubTab, setActiveSubTab] = useState<'species' | 'fur' | 'attire' | 'style'>('species');
  const [speciesCategoryFilter, setSpeciesCategoryFilter] = useState<string>('All');
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [showNegative, setShowNegative] = useState<boolean>(false);
  const [promptToast, setPromptToast] = useState<string | null>(null);

  const compiled = compileFurryPrompt(config);

  const categories = ['All', 'Canines', 'Felines', 'Cybernetic', 'Mythical', 'Small Mammals', 'Scalies'];

  const filteredSpecies = speciesCategoryFilter === 'All'
    ? SPECIES_CATALOG
    : SPECIES_CATALOG.filter(s => s.category === speciesCategoryFilter);

  const handleSpeciesSelect = (name: string, category: string) => {
    const selected = SPECIES_CATALOG.find(s => s.name === name);
    onChangeConfig({
      ...config,
      species: name,
      category: category,
      artStyle: selected?.defaultStyle || config.artStyle
    });
  };

  const toggleAccessory = (item: string) => {
    const exists = config.accessories.includes(item);
    const updated = exists
      ? config.accessories.filter(a => a !== item)
      : [...config.accessories, item];
    onChangeConfig({ ...config, accessories: updated });
  };

  const handleEnhanceWithAI = async () => {
    setIsEnhancing(true);
    try {
      const resp = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          species: config.species,
          traits: [config.furColor, config.patternType, config.expression, ...config.accessories],
          style: config.artStyle,
          mood: config.expression,
          clothes: config.clothing,
          customPrompt: config.customNotes
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.enhancedPrompt) {
          onChangeConfig({
            ...config,
            customNotes: data.enhancedPrompt,
            negativePrompt: data.negativePrompt || config.negativePrompt
          });
          setPromptToast('Prompt enriched with vivid fur & lighting details!');
          setTimeout(() => setPromptToast(null), 3500);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">Character Studio</h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
            <span>{config.species}</span>
            <span aria-hidden="true">·</span>
            <span>{config.artStyle}</span>
            <span aria-hidden="true">·</span>
            <span>{config.aspectRatio}</span>
          </div>
        </div>

        <button
          onClick={onReset}
          title="Reset to default"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Subtabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-950/70 rounded-xl mb-4 border border-slate-800/70">
        <button
          onClick={() => setActiveSubTab('species')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'species'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Species</span>
        </button>

        <button
          onClick={() => setActiveSubTab('fur')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'fur'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          <span>Fur & Pattern</span>
        </button>

        <button
          onClick={() => setActiveSubTab('attire')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'attire'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shirt className="h-3.5 w-3.5" />
          <span>Attire & Gear</span>
        </button>

        <button
          onClick={() => setActiveSubTab('style')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'style'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <SunMedium className="h-3.5 w-3.5" />
          <span>Style & Light</span>
        </button>
      </div>

      {/* Tab 1: Species Selection */}
      {activeSubTab === 'species' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSpeciesCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  speciesCategoryFilter === cat
                    ? 'bg-slate-800 text-white font-medium border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Species Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {filteredSpecies.map((s) => {
              const isSelected = config.species === s.name;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSpeciesSelect(s.name, s.category)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-orange-500/60 bg-orange-500/10 shadow-sm'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-100">{s.name}</span>
                    {isSelected && <Check className="h-3 w-3 text-orange-400" />}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {s.description}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Body Build & Expression */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/70">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Build / Posture</label>
              <select
                value={config.genderOrBuild}
                onChange={(e) => onChangeConfig({ ...config, genderOrBuild: e.target.value })}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="Agile & Slender">Agile & Slender</option>
                <option value="Broad & Muscular">Broad & Muscular</option>
                <option value="Tall & Regal">Tall & Regal</option>
                <option value="Cute & Chubby">Cute & Chubby</option>
                <option value="Sleek Bipedal Chassis">Sleek Bipedal Chassis</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Expression</label>
              <select
                value={config.expression}
                onChange={(e) => onChangeConfig({ ...config, expression: e.target.value })}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
              >
                {EXPRESSION_PRESETS.map((expr) => (
                  <option key={expr} value={expr}>{expr}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Fur & Markings */}
      {activeSubTab === 'fur' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Fur Color Palette</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {COLOR_PALETTES.map((palette) => {
                const isSelected = config.furColor === palette;
                return (
                  <button
                    key={palette}
                    onClick={() => onChangeConfig({ ...config, furColor: palette })}
                    className={`flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
                      isSelected
                        ? 'border-orange-500/60 bg-orange-500/10 text-orange-300 font-medium'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{palette}</span>
                    {isSelected && <Check className="h-3 w-3 text-orange-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Pattern & Markings</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {PATTERN_MARKINGS.map((pat) => {
                const isSelected = config.patternType === pat;
                return (
                  <button
                    key={pat}
                    onClick={() => onChangeConfig({ ...config, patternType: pat })}
                    className={`flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
                      isSelected
                        ? 'border-orange-500/60 bg-orange-500/10 text-orange-300 font-medium'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{pat}</span>
                    {isSelected && <Check className="h-3 w-3 text-orange-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Eye Color</label>
            <input
              type="text"
              value={config.eyeColor}
              onChange={(e) => onChangeConfig({ ...config, eyeColor: e.target.value })}
              placeholder="e.g. Amber Gold, Bioluminescent Cyan"
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Attire & Gear */}
      {activeSubTab === 'attire' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Outfit & Wardrobe</label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {CLOTHING_PRESETS.map((outfit) => {
                const isSelected = config.clothing === outfit;
                return (
                  <button
                    key={outfit}
                    onClick={() => onChangeConfig({ ...config, clothing: outfit })}
                    className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
                      isSelected
                        ? 'border-orange-500/60 bg-orange-500/10 text-orange-300 font-medium'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{outfit}</span>
                    {isSelected && <Check className="h-3 w-3 text-orange-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Accessories & Gear</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {ACCESSORY_OPTIONS.map((item) => {
                const isChecked = config.accessories.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleAccessory(item)}
                    className={`flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
                      isChecked
                        ? 'border-indigo-500/60 bg-indigo-500/10 text-indigo-300 font-medium'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{item}</span>
                    {isChecked && <Check className="h-3 w-3 text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Art Style & Lighting */}
      {activeSubTab === 'style' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Art Aesthetic</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {ART_STYLES.map((style) => {
                const isSelected = config.artStyle === style.name;
                return (
                  <button
                    key={style.id}
                    onClick={() => onChangeConfig({ ...config, artStyle: style.name })}
                    className={`flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
                      isSelected
                        ? 'border-orange-500/60 bg-orange-500/10 text-orange-300 font-medium'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{style.name}</span>
                    {isSelected && <Check className="h-3 w-3 text-orange-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Lighting & Atmosphere</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {LIGHTING_PRESETS.map((light) => {
                const isSelected = config.lighting === light.name;
                return (
                  <button
                    key={light.id}
                    onClick={() => onChangeConfig({ ...config, lighting: light.name })}
                    className={`flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
                      isSelected
                        ? 'border-orange-500/60 bg-orange-500/10 text-orange-300 font-medium'
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

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Background Environment</label>
            <input
              type="text"
              value={config.background}
              onChange={(e) => onChangeConfig({ ...config, background: e.target.value })}
              placeholder="e.g. Neon city rooftop, Misty enchanted pine forest"
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Aspect Ratio</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['1:1', '3:4', '4:3', '16:9'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => onChangeConfig({ ...config, aspectRatio: ratio })}
                  className={`py-1.5 rounded-lg border text-xs font-mono tabular-nums transition-colors ${
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
        </div>
      )}

      {/* Live Prompt Preview & Custom Modifiers */}
      <div className="mt-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Wand2 className="h-3.5 w-3.5 text-orange-400" />
            <span>Compiled Prompt Stream</span>
          </label>

          <button
            onClick={handleEnhanceWithAI}
            disabled={isEnhancing}
            className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
          >
            {isEnhancing ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            <span>{isEnhancing ? 'Enriching...' : 'Enrich with AI'}</span>
          </button>
        </div>

        {promptToast && (
          <div className="text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2.5 py-1 rounded-md mb-2 animate-fade-in">
            {promptToast}
          </div>
        )}

        {/* Live Prompt Box */}
        <div className="rounded-xl bg-slate-950/80 border border-slate-800/90 p-2.5 text-xs text-slate-300 font-mono leading-relaxed max-h-24 overflow-y-auto selection:bg-orange-500/30">
          <span className="text-orange-400 font-medium">Anthropomorphic {config.species}</span>
          {config.furColor && <span className="text-slate-400">, {config.furColor} fur</span>}
          {config.patternType && <span className="text-slate-400">, pattern: {config.patternType}</span>}
          {config.clothing && <span className="text-indigo-300">, wearing {config.clothing}</span>}
          {config.artStyle && <span className="text-amber-300">, {config.artStyle} aesthetic</span>}
          {config.customNotes && <span className="text-cyan-300">, {config.customNotes}</span>}
        </div>

        {/* Custom Notes / Prompt Additions */}
        <div className="mt-2.5">
          <input
            type="text"
            value={config.customNotes}
            onChange={(e) => onChangeConfig({ ...config, customNotes: e.target.value })}
            placeholder="Additional prompt details (e.g., iridescent scales, holding a glowing staff)..."
            className="w-full rounded-lg bg-slate-950/90 border border-slate-800/80 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Negative Prompt Accordion */}
        <div className="mt-2">
          <button
            onClick={() => setShowNegative(!showNegative)}
            className="text-[11px] text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            <span>{showNegative ? '− Hide Negative Prompt' : '+ Negative Prompt Filters'}</span>
          </button>

          {showNegative && (
            <textarea
              rows={2}
              value={config.negativePrompt}
              onChange={(e) => onChangeConfig({ ...config, negativePrompt: e.target.value })}
              className="mt-1.5 w-full rounded-lg bg-slate-950 border border-slate-800/80 p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-orange-500"
            />
          )}
        </div>
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
              Perchance + Fallback
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
              <span>Generating Furry Artwork...</span>
            </>
          ) : (
            <>
              <Flame className="h-4 w-4" />
              <span>Generate via Perchance Engine</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
