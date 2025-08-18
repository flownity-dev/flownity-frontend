# Project Structure

## Root Directory
```
flownity-frontend/
├── src/                    # Source code
├── public/                 # Static assets
├── .kiro/                  # Kiro configuration and steering
├── .vscode/                # VS Code settings
├── node_modules/           # Dependencies
├── dist/                   # Build output (generated)
└── Configuration files
```

## Source Organization (`src/`)
```
src/
├── components/             # React components
│   └── Diagram.tsx        # Main diagram editor component
├── assets/                 # Static assets (images, icons)
├── App.tsx                # Root application component
├── main.tsx               # Application entry point
├── App.css                # Application styles
├── index.css              # Global styles
└── vite-env.d.ts          # Vite type definitions
```

## Configuration Files
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript project references
- `tsconfig.app.json` - App-specific TypeScript config
- `tsconfig.node.json` - Node/build TypeScript config
- `eslint.config.js` - ESLint rules and plugins

## Component Architecture
- **App.tsx** - Root component with full viewport layout
- **Diagram.tsx** - Main feature component containing:
  - Rete.js editor initialization
  - Node creation and management
  - UI controls (zoom, theme toggle, sidebar)
  - Event handling and state management

## Styling Approach
- Inline styles for layout and positioning
- CSS-in-JS with styled-components for complex styling
- Global CSS files for base styles
- Theme-aware styling with dark/light mode support

## Key Patterns
- Single-page application structure
- Component-based architecture
- TypeScript for type safety
- React hooks for state management
- Plugin-based architecture with Rete.js