import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Heart,
  Maximize2,
  Sparkles,
  ExternalLink,
  Layers,
  Wand2,
  RefreshCw
} from 'lucide-react';
import { GeneratedArtwork, FurryCharacterConfig } from '../types';

interface OutputViewportProps {
  currentArtwork: GeneratedArtwork | null;
  isGenerating: boolean;
  onRemix: (config?: FurryCharacterConfig) => void;
  onToggleFavorite: (id: string) => void;
  onOpenLightbox: (artwork: GeneratedArtwork) => void;
  onOpenPerchanceDirect: (prompt: string) => void;
}

export const OutputViewport: React.FC<OutputViewportProps> = ({
  currentArtwork,
  isGenerating,
  onRemix,
  onToggleFavorite,
  onOpenLightbox,
  onOpenPerchanceDirect,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleCopyPrompt = () => {
    if (!currentArtwork) return;
    navigator.clipboard.writeText(currentArtwork.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownload = () => {
    if (!currentArtwork) return;
    const link = document.createElement('a');
    link.href = currentArtwork.imageUrl;
    link.download = `furrycraft_${currentArtwork.species.toLowerCase().replace(/\s+/g, '_')}_${currentArtwork.seed || Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
      {/* Viewport Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-orange-400" />
          <h2 className="text-base font-semibold text-white tracking-tight">Active Viewport</h2>
        </div>

        {currentArtwork && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {currentArtwork.engineUsed === 'perchance' ? 'Perchance Engine' : 'High-Res AI Pipeline'}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              Seed: {currentArtwork.seed}
            </span>
          </div>
        )}
      </div>

      {/* Main Focal Display Area */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/90 flex items-center justify-center group shadow-2xl">
        {/* Loading State Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md p-6 text-center animate-fade-in">
            <div className="relative mb-4 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
              <Sparkles className="absolute h-6 w-6 text-orange-400 animate-pulse" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Synthesizing Furry Art</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Feeding engineered prompt tokens to the generation bridge...
            </p>
          </div>
        )}

        {/* Artwork Image */}
        {currentArtwork ? (
          <>
            <img
              src={currentArtwork.imageUrl}
              alt={currentArtwork.prompt}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />

            {/* Quick Action Overlay on Hover */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onToggleFavorite(currentArtwork.id)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl backdrop-blur-md transition-all ${
                  currentArtwork.isFavorite
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title={currentArtwork.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`h-4 w-4 ${currentArtwork.isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => onOpenLightbox(currentArtwork)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 backdrop-blur-md transition-all shadow-md"
                title="Fullscreen Lightbox"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 text-slate-500">
            <Sparkles className="h-10 w-10 text-slate-600 mb-3" />
            <h3 className="text-sm font-medium text-slate-300 mb-1">Canvas Ready</h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Customize your fursona traits on the left panel and click Generate to start.
            </p>
          </div>
        )}
      </div>

      {/* Control Actions & Perchance Bridge Links */}
      {currentArtwork && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white px-4 py-2.5 text-xs font-semibold transition-colors border border-slate-700/60 shadow-sm"
            >
              {downloadSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Artwork</span>
                </>
              )}
            </button>

            <button
              onClick={() => onRemix(currentArtwork.configSnapshot)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 px-3.5 py-2.5 text-xs font-semibold transition-colors border border-orange-500/30"
              title="Load character settings back into the studio"
            >
              <Wand2 className="h-3.5 w-3.5" />
              <span>Remix</span>
            </button>

            <button
              onClick={handleCopyPrompt}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 px-3 py-2.5 text-xs font-medium transition-colors border border-slate-700/50"
              title="Copy prompt text"
            >
              {copiedPrompt ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Prompt</span>
                </>
              )}
            </button>

            <button
              onClick={() => onOpenPerchanceDirect(currentArtwork.prompt)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 px-3 py-2.5 text-xs font-medium transition-colors border border-slate-700/50"
              title="View directly on perchance.org/ai-furry-generator"
            >
              <ExternalLink className="h-3.5 w-3.5 text-orange-400" />
              <span>Perchance Site</span>
            </button>
          </div>

          {/* Metadata Breakdown (Zero-Pill discipline) */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800/70 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">{currentArtwork.species}</span>
              <span aria-hidden="true">·</span>
              <span>{currentArtwork.style}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{currentArtwork.aspectRatio}</span>
              <span aria-hidden="true">·</span>
              <span>{new Date(currentArtwork.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
              {currentArtwork.prompt}
            </p>

            {currentArtwork.negativePrompt && (
              <p className="text-[11px] text-slate-500 font-mono line-clamp-1 border-t border-slate-800/60 pt-1.5">
                Negative: {currentArtwork.negativePrompt}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
