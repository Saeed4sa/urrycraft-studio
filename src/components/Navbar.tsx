import React from 'react';
import { Sparkles, Dna, Image as ImageIcon, BookOpen, Cpu } from 'lucide-react';

interface NavbarProps {
  activeTab: 'studio' | 'gallery' | 'presets' | 'engine';
  setActiveTab: (tab: 'studio' | 'gallery' | 'presets' | 'engine') => void;
  onRandomize: () => void;
  galleryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRandomize,
  galleryCount,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 border-b border-slate-800/80 bg-slate-950/90 px-6 py-3.5 backdrop-blur-md">
      {/* Zone 1: Brand Wordmark (Single text element in display face) */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setActiveTab('studio');
        }}
        className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-orange-400 transition-colors"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-orange-600 to-amber-500 text-slate-950 font-black shadow-md shadow-orange-500/20">
          F
        </span>
        <span>FurryCraft Studio</span>
      </a>

      {/* Zone 2: 4 clean single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => setActiveTab('studio')}
          className={`flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'studio' ? 'text-orange-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Dna className="h-4 w-4" />
          <span>Character Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'gallery' ? 'text-orange-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          <span>Gallery ({galleryCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('presets')}
          className={`flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'presets' ? 'text-orange-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Archetypes</span>
        </button>

        <button
          onClick={() => setActiveTab('engine')}
          className={`flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'engine' ? 'text-orange-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>Perchance Bridge</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onRandomize}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-orange-400 transition-colors shadow-sm hover:shadow-orange-500/20 whitespace-nowrap shrink-0 active:scale-95"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Surprise Me</span>
        </button>
      </div>
    </header>
  );
};
