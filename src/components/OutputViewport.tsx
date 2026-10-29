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
  Cpu,
  PlusCircle,
  Eye
} from 'lucide-react';
import { GeneratedArtwork, ImageGenerationConfig } from '../types';

interface OutputViewportProps {
  currentArtwork: GeneratedArtwork | null;
  isGenerating: boolean;
  onRemix: (config?: ImageGenerationConfig) => void;
  onToggleFavorite: (id: string) => void;
  onOpenLightbox: (artwork: GeneratedArtwork) => void;
  onOpenPerchanceDirect: (prompt: string) => void;
  onSavePerchanceImage?: (imageUrl: string, prompt: string) => void;
}

export const OutputViewport: React.FC<OutputViewportProps> = ({
  currentArtwork,
  isGenerating,
  onRemix,
  onToggleFavorite,
  onOpenLightbox,
  onOpenPerchanceDirect,
  onSavePerchanceImage,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'perchance-live' | 'artwork'>('artwork');
  const [importUrl, setImportUrl] = useState<string>('');
  const [showImport, setShowImport] = useState<boolean>(false);

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
    link.download = `perchance_${currentArtwork.style.toLowerCase().replace(/\s+/g, '_')}_${currentArtwork.seed || Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (importUrl.trim() && onSavePerchanceImage && currentArtwork) {
      onSavePerchanceImage(importUrl.trim(), currentArtwork.prompt);
      setImportUrl('');
      setShowImport(false);
      setViewMode('artwork');
    }
  };

  const perchanceEmbedUrl = currentArtwork
    ? `https://null.perchance.org/ai-photo-generator#${encodeURIComponent(currentArtwork.prompt)}`
    : `https://null.perchance.org/ai-photo-generator`;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
      {/* Viewport Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-orange-400" />
          <h2 className="text-base font-semibold text-white tracking-tight">Active Viewport</h2>
        </div>

        {/* View Mode Switcher: Live Perchance Generator vs Saved Artwork */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('artwork')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              viewMode === 'artwork'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="h-3 w-3" />
            <span>Image View</span>
          </button>
          <button
            onClick={() => setViewMode('perchance-live')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              viewMode === 'perchance-live'
                ? 'bg-orange-500/20 text-orange-300 font-semibold border border-orange-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="h-3 w-3" />
            <span>Live Perchance Canvas</span>
          </button>
        </div>
      </div>

      {/* Main Focal Display Area */}
      {viewMode === 'artwork' ? (
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/90 flex items-center justify-center group shadow-2xl">
          {/* Loading State Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md p-6 text-center animate-fade-in">
              <div className="relative mb-4 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
                <Sparkles className="absolute h-6 w-6 text-orange-400 animate-pulse" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Synthesizing Artwork</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Generating image via Perchance engine...
              </p>
            </div>
          )}

          {/* Artwork Image */}
          {currentArtwork ? (
            <>
              <img
                src={currentArtwork.imageUrl}
                alt={currentArtwork.style || 'Generated artwork'}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('showcase_portrait.jpg')) {
                    target.src = './images/showcase_portrait.jpg';
                  }
                }}
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
                Type your custom prompt on the left and select your favorite style to generate.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Live Perchance Generator Canvas Mode */
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/90 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-orange-400 flex items-center gap-1.5">
              <Cpu className="h-3 w-3" />
              <span>Perchance Live Engine</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowImport(!showImport)}
                className="text-xs text-slate-300 hover:text-orange-400 transition-colors flex items-center gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Save Result to Gallery</span>
              </button>
            </div>
          </div>

          {showImport && (
            <form onSubmit={handleImportSubmit} className="p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
              <input
                type="url"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="Paste generated Perchance image address..."
                className="flex-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-orange-500 text-slate-950 text-xs font-semibold hover:bg-orange-400 transition-colors"
              >
                Save
              </button>
            </form>
          )}

          <iframe
            src={perchanceEmbedUrl}
            title="Perchance AI Photo Generator"
            className="w-full flex-1 border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      )}

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
                  <span>Download Image</span>
                </>
              )}
            </button>

            <button
              onClick={() => onRemix(currentArtwork.configSnapshot)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 px-3.5 py-2.5 text-xs font-semibold transition-colors border border-orange-500/30"
              title="Load prompt settings back into the studio"
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
                  <span>Copy Prompt</span>
                </>
              )}
            </button>

            <button
              onClick={() => onOpenPerchanceDirect(currentArtwork.prompt)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 px-3 py-2.5 text-xs font-medium transition-colors border border-slate-700/50"
              title="Open full page on perchance.org"
            >
              <ExternalLink className="h-3.5 w-3.5 text-orange-400" />
              <span>Perchance.org</span>
            </button>
          </div>

          {/* Metadata Breakdown (Zero-Pill discipline) */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800/70 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">{currentArtwork.style}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{currentArtwork.aspectRatio}</span>
              <span aria-hidden="true">·</span>
              <span>{new Date(currentArtwork.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span aria-hidden="true">·</span>
              <span className="text-orange-400 font-medium">Perchance Engine</span>
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
