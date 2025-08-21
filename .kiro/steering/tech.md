# Technology Stack

## Core Framework
- **React 18.3.1** with TypeScript for UI components
- **Vite 7.1.2** as build tool and development server
- **TypeScript 5.9.2** for type safety

## Key Libraries
- **Material-UI (MUI) 7.3.1** - Primary UI component library
  - `@mui/material` - Core components
  - `@mui/icons-material` - Icon library
  - `@mui/x-date-pickers` - Date picker components
- **React Router DOM 7.8.1** - Client-side routing
- **ReactFlow 11.11.4** - Interactive node-based diagrams and flowcharts
- **Emotion 11.14.0** - CSS-in-JS styling (MUI dependency)
- **styled-components 6.1.19** - Additional CSS-in-JS styling
- **Dagre 0.8.5** - Graph layout algorithms for automatic node positioning
- **Day.js 1.11.13** - Date manipulation library
- **web-worker 1.5.0** - Web Worker utilities

## Development Tools
- **ESLint 9.33.0** with TypeScript, React, and Prettier integration
- **Prettier 3.6.2** for code formatting
- **@vitejs/plugin-react** for React support in Vite
- **typescript-eslint 8.39.1** - TypeScript-specific ESLint rules

## Common Commands

### Development
```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production (TypeScript + Vite)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint checks
```

### Project Structure
- Uses ES modules (`"type": "module"`)
- TypeScript project references for better build performance
- Separate configs for app and node environments

## Build Configuration
- Vite handles bundling and optimization
- TypeScript compilation happens before Vite build
- ESLint configured for React hooks and TypeScript best practices