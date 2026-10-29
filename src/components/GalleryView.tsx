import React, { useState } from 'react';
import {
  Search,
  Heart,
  Maximize2,
  Wand2,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { GeneratedArtwork, ImageGenerationConfig } from '../types';

interface GalleryViewProps {
  artworks: GeneratedArtwork[];
  onSelectArtwork: (artwork: GeneratedArtwork) => void;
  onRemix: (config?: ImageGenerationConfig) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteArtwork: (id: string) => void;
  onClearGallery: () => void;
  onOpenLightbox: (artwork: GeneratedArtwork) => void;
  onSwitchToStudio: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  artworks,
  onSelectArtwork,
  onRemix,
  onToggleFavorite,
  onDeleteArtwork,
  onClearGallery,
  onOpenLightbox,
  onSwitchToStudio,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'favorites'>('all');
  const [styleFilter, setStyleFilter] = useState<string>('all');
  const [nsfwFilter, setNsfwFilter] = useState<'all' | 'safe' | 'nsfw'>('all');

  const styleList = Array.from(new Set(artworks.map(a => a.style))).filter(Boolean);

  const filteredArtworks = artworks.filter((item) => {
    if (filterType === 'favorites' && !item.isFavorite) return false;
    if (styleFilter !== 'all' && item.style !== styleFilter) return false;
    if (nsfwFilter === 'safe' && item.isNsfw) return false;
    if (nsfwFilter === 'nsfw' && !item.isNsfw) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.prompt.toLowerCase().includes(q) ||
        (item.style || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Strip */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images by prompt keywords or style..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({artworks.length})
            </button>
            <button
              onClick={() => setFilterType('favorites')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterType === 'favorites'
                  ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="h-3.5 w-3.5 fill-current text-rose-400" />
              <span>Favorites</span>
            </button>
          </div>

          {styleList.length > 1 && (
            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
              className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Styles</option>
              {styleList.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          )}

          {artworks.length > 0 && (
            <button
              onClick={onClearGallery}
              title="Clear all generated history"
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-xl transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Artwork Grid */}
      {filteredArtworks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredArtworks.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/50"
            >
              {/* Image Container */}
              <div
                onClick={() => onSelectArtwork(item)}
                className="relative aspect-square w-full overflow-hidden bg-slate-950 cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.style || 'Generated image'}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('showcase_portrait.jpg')) {
                      target.src = './images/showcase_portrait.jpg';
                    }
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 z-10">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemix(item.configSnapshot);
                      }}
                      title="Remix this prompt in studio"
                      className="p-2 rounded-lg bg-slate-900/90 text-orange-400 hover:bg-orange-500 hover:text-slate-950 transition-colors backdrop-blur-md"
                    >
                      <Wand2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLightbox(item);
                      }}
                      title="Inspect full screen"
                      className="p-2 rounded-lg bg-slate-900/90 text-white hover:bg-slate-800 transition-colors backdrop-blur-md"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    title={item.isFavorite ? 'Remove favorite' : 'Add favorite'}
                    className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
                      item.isFavorite
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Card Footer: Clean Zero-Pill Typography */}
              <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-200 truncate">{item.style}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{item.aspectRatio}</span>
                    {item.isNsfw && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-400 text-[10px]">NSFW</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 font-sans leading-relaxed">
                    {item.prompt}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 text-[11px] text-slate-500 font-mono tabular-nums">
                  <span>Seed: {item.seed}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/40 p-12 text-center">
          <ImageIcon className="h-12 w-12 text-slate-600 mb-4" />
          <h3 className="text-base font-semibold text-white mb-1">No Artwork Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
            {searchQuery
              ? 'No generated creations match your search keywords. Try adjusting your query or filters.'
              : 'Your gallery is empty. Head into the Generator Studio to create your first image!'}
          </p>

          <button
            onClick={onSwitchToStudio}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-orange-400 transition-colors shadow-md shadow-orange-500/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Open Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
