import React, { useEffect, useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Wand2,
  Heart,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { GeneratedArtwork, FurryCharacterConfig } from '../types';

interface LightboxModalProps {
  artwork: GeneratedArtwork | null;
  onClose: () => void;
  onRemix: (config?: FurryCharacterConfig) => void;
  onToggleFavorite: (id: string) => void;
  onOpenPerchanceDirect: (prompt: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  artwork,
  onClose,
  onRemix,
  onToggleFavorite,
  onOpenPerchanceDirect,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!artwork) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(artwork.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = artwork.imageUrl;
    link.download = `furrycraft_${artwork.species.toLowerCase().replace(/\s+/g, '_')}_${artwork.seed || Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 sm:p-6 animate-fade-in">
      <div className="relative flex flex-col lg:flex-row w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors backdrop-blur-md"
          title="Close (Esc)"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Visual Artwork Area */}
        <div className="relative lg:w-3/5 bg-slate-950 flex items-center justify-center p-4">
          <img
            src={artwork.imageUrl}
            alt={`${artwork.species} artwork`}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('showcase_furry_fox.jpg')) {
                target.src = './images/showcase_furry_fox.jpg';
              }
            }}
            className="max-h-[60vh] lg:max-h-[82vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
          />
        </div>

        {/* Details & Action Panel */}
        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto bg-slate-900/90 border-t lg:border-t-0 lg:border-l border-slate-800">
          <div className="space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-orange-400">
                  {artwork.engineUsed === 'perchance' ? 'Perchance AI Engine' : 'High-Res AI Pipeline'}
                </span>

                <button
                  onClick={() => onToggleFavorite(artwork.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    artwork.isFavorite
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={artwork.isFavorite ? 'Remove favorite' : 'Add favorite'}
                >
                  <Heart className={`h-4 w-4 ${artwork.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <h2 className="text-xl font-bold text-white mt-1.5 tracking-tight">
                {artwork.species}
              </h2>

              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>{artwork.style}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{artwork.aspectRatio}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">Seed: {artwork.seed}</span>
              </div>
            </div>

            {/* Prompt Section */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Prompt Formulation</label>
              <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3 text-xs text-slate-300 leading-relaxed font-sans max-h-36 overflow-y-auto selection:bg-orange-500/30">
                {artwork.prompt}
              </div>
            </div>

            {/* Negative Prompt */}
            {artwork.negativePrompt && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Negative Prompt Filters</label>
                <div className="rounded-lg bg-slate-950/50 border border-slate-800/50 p-2.5 text-[11px] text-slate-400 font-mono leading-relaxed max-h-20 overflow-y-auto">
                  {artwork.negativePrompt}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-slate-800/80 mt-6 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-orange-500/20"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download High-Res</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onRemix(artwork.configSnapshot);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 text-xs font-semibold transition-colors border border-slate-700/60"
              >
                <Wand2 className="h-4 w-4 text-orange-400" />
                <span>Remix in Studio</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyPrompt}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 px-3 py-2 text-xs font-medium transition-colors border border-slate-800"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onOpenPerchanceDirect(artwork.prompt)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 px-3 py-2 text-xs font-medium transition-colors border border-slate-800"
              >
                <ExternalLink className="h-3.5 w-3.5 text-orange-400" />
                <span>Perchance Bridge</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
