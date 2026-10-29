import React, { useState } from 'react';
import { ExternalLink, Cpu, ShieldCheck, Terminal, Sparkles, RefreshCw } from 'lucide-react';

interface PerchanceEngineModalProps {
  currentPrompt: string;
}

export const PerchanceEngineModal: React.FC<PerchanceEngineModalProps> = ({ currentPrompt }) => {
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'info' | 'live-embed'>('info');

  const perchanceUrl = `https://perchance.org/ai-photo-generator`;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-1">
              <Cpu className="h-4 w-4" />
              <span>Perchance Bridge Architecture</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Perchance AI Image Generator Connection
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              PixelStudio communicates directly with the Perchance generator ecosystem (<code className="text-orange-300 font-mono">perchance.org/ai-photo-generator</code> and image generation nodes). Prompts compiled in the studio are dispatched to the generator pipeline with automatic image capture and fallback protection.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={perchanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 text-xs font-semibold transition-colors border border-slate-700/60"
            >
              <span>Visit Perchance.org</span>
              <ExternalLink className="h-3.5 w-3.5 text-orange-400" />
            </a>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-800/70">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveView('info')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeView === 'info'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pipeline Specifications
            </button>
            <button
              onClick={() => setActiveView('live-embed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeView === 'live-embed'
                  ? 'bg-orange-500/20 text-orange-300 font-semibold border border-orange-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Live Embedded Perchance Generator</span>
            </button>
          </div>
        </div>
      </div>

      {activeView === 'info' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Terminal className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Full Prompt Freedom</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accepts your own raw custom prompts or augments them with professional art styles, lighting, and camera lens tokens.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">NSFW Filter Controls</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides an instant toggle between strict Safe Search (filtering adult/explicit content) and Uncensored mode for unrestricted creative freedom.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Universal Diffusion Support</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates photoreal portraits, anime, 3D renders, landscapes, oil paintings, and fantasy concepts with zero latency.
            </p>
          </div>
        </div>
      ) : (
        /* Live Embedded Generator View */
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Target Frame: <code className="text-orange-300 font-mono">perchance.org/ai-photo-generator</code></span>
            <span className="text-slate-500">Live Client Sandboxed Iframe</span>
          </div>

          <div className="relative w-full h-[650px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400">
                <RefreshCw className="h-6 w-6 animate-spin text-orange-400 mb-2" />
                <span className="text-xs">Loading Perchance Generator...</span>
              </div>
            )}
            <iframe
              src={perchanceUrl}
              title="Perchance AI Photo Generator"
              className="w-full h-full border-0"
              onLoad={() => setIframeLoaded(true)}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      )}
    </div>
  );
};
