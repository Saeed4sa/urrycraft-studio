# FurryCraft Studio — Perchance AI Generator & Creative Suite

A modern creative web application that bridges directly with the Perchance AI Furry Generator (`https://perchance.org/ai-furry-generator`), feeds customized and engineered prompts to the generation engine, receives generated artwork back, and provides a visual character creator, instant remixing, and a high-resolution gallery.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX decisions were confirmed during the Phase 1 clarification interview:
> - **Generation Engine**: Dual-bridge architecture featuring direct live integration with the Perchance Furry Generator engine alongside seamless high-res AI fallback when Perchance is rate-limited or offline.
> - **Creator Experience**: Visual character builder equipped with species taxonomy (canine, feline, vulpine, dragon, protogen, avian, hybrid), anatomical traits, clothing, lighting, and artistic rendering presets.
> - **Gallery & Output Management**: Persistent local creation history, high-resolution downloads, one-click prompt remixing, side-by-side inspection, and character sheet metadata exports.

- **Confirmed Decision 1**: Live Perchance generation bridge with automatic fallback ensuring users never face empty broken outputs.
- **Confirmed Decision 2**: Interactive visual prompt assembler that formats specialized prompt tags (e.g., anthro tags, species details, lighting conditions, negative prompts) tuned for the Perchance generator models.
- **Confirmed Decision 3**: LocalStorage-backed media archive preserving prompts, seeds, timestamps, and generation parameters for quick re-generation and iterative tuning.

---

## 1. Overview & Core Concept

### What It Does
FurryCraft Studio transforms the experience of creating anthropomorphic artwork through `perchance.org/ai-furry-generator`. Users can either type freeform prompts or use the visual character studio to customize species, body traits, expressions, outfits, color palettes, and rendering aesthetics. The app feeds prompts directly to the Perchance generator, extracts the resulting images in real-time, displays live previews, and stores creations in a gallery with one-click remixing and high-resolution export.

### Target Audience & Persona
Furry artists, character designers, tabletop gamers, and roleplayers seeking an intuitive, responsive interface to design Original Characters (OCs), generate avatar portraits, experiment with fursona color schemes, and archive prompt iterations without ads, clunky forms, or lost generations.

### Key Value
- **Zero Friction**: No account or API key required to start generating via Perchance.
- **Enhanced Creativity**: Modular trait picker eliminates prompt guesswork by providing curated species descriptors, lighting keywords, and style modifiers known to yield high-quality furry art.
- **Resilient Pipeline**: Transparent failover to high-fidelity AI generation prevents interrupted workflows if external servers throttle requests.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Creation & Customization**:
   - The user opens the Studio view.
   - They choose a species (e.g., Arctic Fox, Protogen, Dragon, Timber Wolf), select traits (fluffy mane, glowing markings, tech visor, steampunk armor), and choose an art style (Anime Cel-Shaded, 3D Digital Render, Classic Watercolor, Oil Painting).
   - The active prompt preview updates live with formatted positive and negative tags.
2. **Generation & Live Bridge**:
   - The user clicks **Generate Artwork**.
   - The live Perchance engine dispatches the prompt. A real-time generation indicator shows status.
   - The generated artwork appears immediately in the focal viewport with full metadata (species, style tags, timestamp).
3. **Inspection, Remix & Export**:
   - The user inspects the art, toggles a fullscreen lightbox view, or clicks **Remix** to load all source parameters back into the creator.
   - They can download the image in high-resolution, copy the prompt, or save it to their favorites in the gallery.
4. **History & Comparison**:
   - The user navigates to the Gallery tab to review past creations, filter by species or style, and compare variations side by side.

### Visual Identity & Theme
- **Aesthetic Direction**: Sleek creative studio environment inspired by digital art workstations and creative darkrooms. Crisp dark slate surfaces with warm ember and electric cobalt interactive accents.
- **Color Palette (60-30-10 discipline)**:
  - *Canvas (60%)*: Deep slate dark canvas (`#0b0f17`) and neutral backdrop (`#111827`).
  - *Surfaces & Cards (30%)*: Subdued matte slate (`#1a2234`) with crisp hairline borders (`rgba(255, 255, 255, 0.08)`).
  - *Accent Budget (10%)*: Radiant amber/orange focal accents (`#f97316`) for generation CTAs, and electric indigo (`#6366f1`) for active selection states.
- **Typography & Hierarchy**:
  - *Display & Headings*: Geometric, contemporary sans (`Plus Jakarta Sans` / `Outfit`) with tight tracking and balanced headlines (`text-wrap: balance`).
  - *Body Prose*: Clear, legible sans (`DM Sans` / `Plus Jakarta Sans`) at 14px–15px.
  - *Metadata & Numerals*: Tabular figures (`tabular-nums`, `font-mono`) for resolution tags, seeds, timestamps, and generation counters.
- **Zero-Pill Compliance**:
  - Category tags and species metadata rendered as clean unboxed inline text with typographic separators (`Wolf · Digital Art · 1024×1024 · 2s ago`).
  - Interactive tabs and segment selectors styled with clean button states, avoiding static colored pill capsules.
  - No decorative status dots or fake telemetry tickers.

### Interactive Feedback & Motion
- Micro-interactions on buttons and trait chips with smooth $\le 200\text{ms}$ easing curves.
- Shimmer skeleton during image generation transitions.
- High-contrast modal lightbox with keyboard shortcuts (`Escape` to close, arrow keys for navigation).

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Perchance Live Bridge with Seamless AI Fallback
- **Chosen Approach**: Combine a direct Perchance generator bridge (running the generator with prompt dispatch and image interception) with a server-side high-res AI fallback pipeline.
- **Why**: Perchance image servers can occasionally encounter Cloudflare verification challenges or heavy traffic. Having a seamless fallback ensures uninterrupted creative output while honoring the primary Perchance generator request.
- **Alternatives Considered**: Direct iframe only (vulnerable to third-party ad injection and mobile layout distortion) or pure fallback (ignores the requested Perchance engine).

### Decision 2: Visual Trait Builder + Freeform Prompt Dual Mode
- **Chosen Approach**: Provide both an intuitive visual trait selector (species, archetype, mood, clothing, backdrop, lighting) and an advanced freeform prompt text area that syncs dynamically.
- **Why**: Beginners and rapid creators can tap traits in seconds without remembering syntax, while advanced prompt engineers can fine-tune raw prompt strings and negative prompts directly.

### Decision 3: Client-Side Gallery Persistence
- **Chosen Approach**: Persist generated images, prompts, and metadata in IndexedDB / LocalStorage with instant client-side search, filtering, and export.
- **Why**: Preserves user privacy, works offline for previously generated art, eliminates login barriers, and provides zero-latency gallery browsing.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FurryCraft Studio UI                            │
├────────────────────────────────────────────────────────────────────────┤
│  Top Bar (Wordmark · Navigation Tabs · New Generation CTA)              │
│                                                                        │
│  ┌───────────────────────────────┐  ┌────────────────────────────────┐ │
│  │     Character Creator         │  │     Live Viewport & Output     │ │
│  │ ───────────────────────────── │  │ ────────────────────────────── │ │
│  │ • Species & Trait Selector    │  │ • Live Output Display          │ │
│  │ • Color Palette & Markings    │  │ • Resolution & Ratio Controls  │ │
│  │ • Art Style & Lighting        │  │ • Action Bar (Download/Remix)  │ │
│  │ • Raw & Negative Prompt Sync  │  │ • Generation Engine Indicator  │ │
│  └──────────────┬────────────────┘  └───────────────▲────────────────┘ │
│                 │                                   │                  │
│                 ▼                                   │                  │
│  ┌──────────────────────────────────────────────────┴────────────────┐ │
│  │               Generation Bridge Controller                        │ │
│  │  1. Formats Prompt with optimized Furry SDXL/Perchance tokens     │ │
│  │  2. Dispatches to Perchance generator interface / API proxy       │ │
│  │  3. Intercepts image blob/URL & validates payload integrity       │ │
│  │  4. Falls back gracefully to server AI route if bridge throttles  │ │
│  └──────────────────────┬───────────────────────────▲────────────────┘ │
│                         │                           │                  │
└─────────────────────────┼───────────────────────────┼──────────────────┘
                          ▼                           │
             ┌────────────────────────┐  ┌────────────┴─────────────┐
             │ Perchance Furry Engine │  │ Express Server Proxy API  │
             │ (Browser / Web Bridge) │  │ (/api/generate & Gemini)  │
             └────────────────────────┘  └──────────────────────────┘
                          │
                          ▼
             ┌────────────────────────┐
             │ LocalStorage / Cache   │
             │ (Creations & History)  │
             └────────────────────────┘
```

### Data Model & State Strategy

```typescript
interface FurryCharacterConfig {
  species: string;          // e.g. "Arctic Wolf", "Snow Leopard", "Protogen"
  subspecies?: string;
  genderOrBuild: string;    // e.g. "Feminine", "Masculine", "Androgynous", "Muscular"
  furColor: string;         // e.g. "Silver and Navy Blue"
  eyeColor: string;         // e.g. "Bioluminescent Gold"
  expression: string;       // e.g. "Confident smirk", "Gentle smile"
  clothing: string;         // e.g. "Cyberpunk leather jacket", "Mage robes"
  accessories: string[];    // e.g. ["Horns", "Headphones", "Piercings"]
  artStyle: string;         // e.g. "Modern Anime", "Digital Concept Art", "FurAffinity Classic"
  lighting: string;         // e.g. "Cinematic rim light", "Moody neon"
  background: string;       // e.g. "Lush forest canopy", "Neon city alley"
  aspectRatio: "1:1" | "3:4" | "4:3" | "16:9";
  negativePrompt: string;
  customPromptText: string;
}

interface GeneratedArtwork {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  prompt: string;
  negativePrompt: string;
  species: string;
  style: string;
  engineUsed: "perchance" | "ai-fallback";
  createdAt: number;
  isFavorite: boolean;
  aspectRatio: string;
  metadata: Record<string, string>;
}
```

### Component Hierarchy & Handlers
- **`App.tsx`**: Top-level layout with top navigation, active tab routing (Studio, Gallery, Presets, About Perchance Bridge), and notification toasts.
- **`CreatorPanel.tsx`**: Interactive form controls with presets for popular furry species, traits, styles, and prompt synchronization.
- **`OutputViewport.tsx`**: Active generation monitor with loading animation, image zoom, quick download, and remix dispatch.
- **`PerchanceBridge.tsx`**: Underlying communication coordinator handling prompt dispatch to Perchance, timeout detection, and fallback execution.
- **`GalleryView.tsx`**: Grid of saved creations with search, species filtering, favorites toggle, batch download, and side-by-side comparison.
- **`LightboxModal.tsx`**: Fullscreen artwork inspection modal with full EXIF/prompt inspection and high-res export.

---

## 5. Verification & Implementation Steps

1. **Server Proxy & API Bridge**: Configure Express server (`server.ts`) to handle proxy requests to Perchance image endpoints and provide fallback generation via `@google/genai`.
2. **UI & Character Studio Components**: Build the responsive two-column creator suite following strict anti-slop guidelines and clean typographic hierarchy.
3. **Gallery & Storage**: Implement local creation storage, export utilities, and one-click remixing.
4. **Build Verification**: Run `compile_applet` and verify zero errors, seamless layout stability, and full interaction responsiveness.
