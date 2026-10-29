import React from 'react';
import { PRESET_TEMPLATES } from '../data/studioData';
import { PresetTemplate } from '../types';
import { Sparkles, ArrowRight, Wand2 } from 'lucide-react';

interface PresetsModalProps {
  onSelectTemplate: (template: PresetTemplate) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({ onSelectTemplate }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-1">
          <Sparkles className="h-4 w-4" />
          <span>Curated Style Presets</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Ready-to-Use Artistic Styles & Prompts
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Select any template below to immediately populate your Studio with optimized prompt phrasing, lens mechanics, and aesthetic lighting tokens.
        </p>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PRESET_TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/40"
          >
            {/* Visual Thumbnail */}
            <div className="sm:w-2/5 aspect-square sm:aspect-auto relative overflow-hidden bg-slate-950">
              <img
                src={tmpl.previewImage}
                alt={tmpl.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('showcase_portrait.jpg')) {
                    target.src = './images/showcase_portrait.jpg';
                  }
                }}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content & Load Action */}
            <div className="sm:w-3/5 p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-orange-400">{tmpl.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{tmpl.config.style}</span>
                </div>

                <h3 className="text-lg font-bold text-white mt-1 tracking-tight">
                  {tmpl.title}
                </h3>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {tmpl.tagline}
                </p>

                {/* Trait Tags (Unboxed zero-pill text) */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 mt-3">
                  <span>{tmpl.config.lighting}</span>
                  <span aria-hidden="true">/</span>
                  <span className="truncate max-w-[140px]">{tmpl.config.camera}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectTemplate(tmpl)}
                className="flex items-center justify-between w-full rounded-xl bg-slate-800/80 hover:bg-orange-500 text-slate-200 hover:text-slate-950 px-4 py-2.5 text-xs font-semibold transition-all border border-slate-700/60 hover:border-orange-500 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Wand2 className="h-3.5 w-3.5" />
                  <span>Load Into Studio</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
