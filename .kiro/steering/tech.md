# Technology Stack

## Core Framework
- **React 18.3.1** with TypeScript for UI components
- **Vite 7.1.2** as build tool and development server
- **TypeScript 5.9.2** for type safety

## Key Libraries
- **Rete.js 2.0.6** - Core node editor framework
- **rete-area-plugin** - Viewport and area management
- **rete-connection-plugin** - Node connections and flow
- **rete-react-plugin** - React integration for Rete
- **rete-auto-arrange-plugin** - Automatic node layout
- **styled-components 6.1.19** - CSS-in-JS styling
- **elkjs 0.10.0** - Graph layout algorithms

## Development Tools
- **ESLint 9.33.0** with TypeScript, React, and Prettier integration
- **Prettier 3.6.2** for code formatting
- **@vitejs/plugin-react** for React support in Vite

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