# MoonSound 🌙

A minimal, soothing web application designed to help manage tinnitus through customizable audio therapy. Built with React, Vite, TypeScript, and TailwindCSS, featuring a calming dark theme with Moon brand identity.

## ✨ Features

### 🎵 Core Audio Features
- **Pure Tone Generator**: Adjustable frequency range from 500 Hz to 20,000 Hz
- **Smooth Audio Transitions**: Exponential ramping to prevent clicks and pops
- **Volume Control**: Safe volume cap at 0.4 gain maximum
- **Frequency Persistence**: Remembers your last frequency and volume settings via localStorage

### 🔍 Guided Frequency Finder
- **Interactive Sweep**: Automated frequency sweep from 800 Hz to 10,000 Hz over 4 seconds
- **Step-by-Step Guidance**: "¿Se parece a tu pitido?" flow with up/down adjustments
- **Fine-Tuning**: ±500 Hz adjustments to match your tinnitus frequency
- **Personalized Results**: Saves your found frequency with therapeutic messaging
- **Quick Replay**: "Escuchar tu frecuencia" button to replay your saved frequency anytime

### 🌊 Therapeutic Noise Modes (Modo Calma)
Three noise therapy options with band-pass filtering around your frequency:

- **🌬 Ruido Blanco**: Ideal for masking sharp tinnitus or when silence feels uncomfortable
- **🌿 Ruido Rosa**: Perfect for relaxation without disconnecting - natural and calming
- **🌙 Ruido Marrón**: Warmer and deeper - use when you need to rest or unwind

Each mode includes helpful tooltips explaining its therapeutic benefits.

### 🎨 Visual Experience
- **Lunar Waves Animation**: Real-time visual feedback that reacts to frequency
  - Lower frequencies = slower, wider pulses
  - Higher frequencies = faster, thinner pulses
  - Pauses when audio stops
- **Moon Brand Identity**: Dark, minimalist design with calming colors
  - Midnight Navy background (#1B1F3B)
  - Lavender Mist accents (#D6C4F0)
  - Soft glow effects on interactive elements

### 💭 Session Reflection
Gentle, randomly selected messages appear when you stop audio:
- "Hoy te conectaste con el silencio. 🌙"
- "Vuelve cuando necesites respirar."
- "El silencio también es parte de la música."

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with Web Audio API support
- (Optional) Cloudflare Tunnel CLI (`cloudflared`) for public access during development

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Dagudelot/moonsound.git
cd moonsound
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

Preview the production build:
```bash
npm run preview
```

## 🏗️ Project Structure

```
mvp/
├── public/
│   ├── logo.png              # Main logo
│   ├── logo-full.png         # Favicon
│   └── favicon.svg           # Legacy favicon
├── src/
│   ├── components/
│   │   ├── Controls.tsx              # Play/Pause and volume controls
│   │   ├── FrequencySlider.tsx       # Frequency adjustment slider
│   │   ├── GuidedFrequencyFinder.tsx # Guided frequency discovery flow
│   │   ├── Logo.tsx                  # Moon logo component
│   │   ├── LunarWaves.tsx            # Visual animation component
│   │   ├── ModoCalma.tsx             # Noise mode selection
│   │   ├── SessionReflection.tsx     # End-of-session messages
│   │   └── icons/
│   │       ├── PlayIcon.tsx
│   │       └── PauseIcon.tsx
│   ├── hooks/
│   │   ├── useAudioEngine.ts          # Basic audio engine (legacy)
│   │   └── useAudioEngineExtended.ts  # Extended engine with noise modes
│   ├── lib/
│   │   └── storage.ts                 # localStorage helpers
│   ├── App.tsx                        # Main application component
│   ├── main.tsx                       # Application entry point
│   └── styles.css                     # TailwindCSS and custom styles
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## 🎛️ Usage

### First Time Setup
1. Click **"Activar audio"** to enable the Web Audio API (required for browser security)
2. Adjust the frequency slider until it matches your tinnitus pitch
3. Use the play button (▶️) to start the tone

### Finding Your Frequency
1. Click **"Encuentra tu frecuencia"**
2. Listen to the automated sweep
3. When prompted, use the up/down buttons to fine-tune
4. Confirm when it matches your tinnitus
5. Your frequency is saved automatically

### Using Noise Modes
1. Select a noise mode from **"Modo calma"** (hover for descriptions)
2. Click the play button to start the noise
3. The noise is filtered around your current frequency (±2 kHz)
4. Switch between modes or return to tone mode anytime

## 🎨 Design Philosophy

MoonSound is designed to feel like a **quiet space** - not a dashboard. Every element is crafted to:
- Evoke calm and serenity
- Provide emotional grounding
- Feel organic and non-commercial
- Maintain accessibility standards

### Color Palette
- **Midnight Navy** (#1B1F3B): Main background
- **Navy 2** (#2D2F50): Gradient variation
- **Lunar White** (#F2F2F2): Primary text
- **Ash Grey** (#D1D5DB): Secondary text
- **Lavender Mist** (#D6C4F0): Accents and highlights

## 🔧 Technical Details

### Audio Implementation
- **Web Audio API**: Native browser audio processing
- **OscillatorNode**: Sine wave generation for pure tones
- **AudioBufferSourceNode**: Noise generation for therapeutic modes
- **BiquadFilterNode**: Band-pass filtering around user frequency
- **GainNode**: Smooth volume control with safety caps

### Safety Features
- Maximum gain capped at 0.4 (40%)
- Exponential ramping for all audio transitions (80ms)
- User gesture required to activate audio context
- iOS context suspension handling

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 11+)
- Mobile browsers: Optimized for touch interactions

### Performance
- Canvas-based animations for visual feedback
- Efficient Web Audio API usage
- Minimal re-renders with React hooks
- localStorage for persistence (no server required)

## 📱 Mobile-First Design

- Touch-friendly controls (minimum 44px targets)
- Responsive layout optimized for 360-430px widths
- Smooth animations with hardware acceleration
- Accessible focus states and ARIA labels

## 🌐 Deployment

### Quick Public Access with Cloudflare Tunnel

For instant public access during development:

1. **Install Cloudflare Tunnel** (if not already installed):
   ```bash
   # macOS
   brew install cloudflared
   
   # Or download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **In a new terminal, start the tunnel**:
   ```bash
   cloudflared tunnel --url http://localhost:5173
   ```

4. **Copy the public URL** shown in the output (e.g., `https://xxxxx.trycloudflare.com`)

The tunnel will remain active as long as the command is running. The URL is temporary and changes each time you restart the tunnel.

**Note**: The `vite.config.ts` is already configured to allow Cloudflare tunnel hosts.

### Production Deployment

#### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts (auto-detects Vite)

#### Netlify
1. Build: `npm run build`
2. Deploy: `netlify deploy --prod --dir=dist`

#### Cloudflare Pages
1. Connect your GitHub repo at [dash.cloudflare.com](https://dash.cloudflare.com)
2. Build command: `npm run build`
3. Output directory: `dist`

#### Other Platforms
The `dist` folder contains static files that can be deployed to any hosting service.

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the repository owner.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Bundled with [Vite](https://vitejs.dev/)
- Audio powered by the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## 📧 Support

For issues or questions, please open an issue on GitHub or contact the maintainers.

---

**MoonSound** - *"Entendí mi sonido, y puedo volver cuando quiera a escuchar mi silencio."*

