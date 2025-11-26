# BrowsePaddle

**Your personal home hub** — a clean, smart start point for your digital life.

BrowsePaddle puts all your important stuff in one place: bookmarks, reading lists, news, weather, and quick links in a beautiful, minimal interface.

## Features

- **Home Hub** — Personal landing page with greeting, time/date, and search
- **Quick Links** — Configurable shortcut tiles with drag-to-reorder
- **Weather Widget** — Real-time weather using Open-Meteo API with geolocation
- **News Feed** — RSS feeds from configurable sources (Hacker News, TechCrunch, etc.)
- **Bookmarks Manager** — Organize bookmarks with folders, import/export JSON
- **Reading List** — Save articles for later, mark as read/unread
- **Settings** — Theme toggle (dark/light), search engine preference, section visibility

## Tech Stack

- **Angular 21** — Standalone components, signals, new control flow
- **Tailwind CSS 4** — Custom theme with surface/accent colors
- **Angular CDK** — Drag-and-drop functionality
- **Local Storage** — All data persisted locally (no backend required)

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Navigate to project
cd browse-paddle

# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:4200`

### Build

```bash
# Production build
npm run build

# Output in dist/browse-paddle
```

## Project Structure

```
src/app/
├── core/
│   ├── models/         # TypeScript interfaces
│   └── services/       # Data services (storage, settings, weather, etc.)
├── features/
│   ├── home/           # Main home page
│   ├── bookmarks/      # Bookmarks manager
│   ├── reading-list/   # Reading list page
│   └── settings/       # Settings page
└── shared/
    └── components/     # Reusable widgets (greeting, search, weather, etc.)
```

## API Integrations

| Feature | API | Notes |
|---------|-----|-------|
| Weather | [Open-Meteo](https://open-meteo.com) | Free, no API key required |
| News | [rss2json](https://rss2json.com) | RSS feed parsing |
| Favicons | Google S2 | Automatic favicon fetching |

## Customization

### Themes

Toggle between dark and light mode in Settings. The app defaults to dark mode.

### Search Engine

Choose your default search engine: Google, DuckDuckGo, or Bing.

### Section Visibility

Show/hide individual sections on the home page:
- Quick Links
- Weather
- News Feed
- Reading List

## Roadmap

- [ ] Browser extension (New Tab override)
- [ ] AI-powered daily brief
- [ ] Bookmark organization with AI
- [ ] Weekly digest
- [ ] Desktop application (Electron/Tauri)

## License

MIT

---

Built with ❤️ using Angular 21 and Tailwind CSS 4
