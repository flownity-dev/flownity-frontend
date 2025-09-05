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
│   ├── Diagram.tsx        # ReactFlow-based diagram editor
│   ├── Homepage.tsx       # Main dashboard with projects and tasks
│   ├── Login.tsx          # Authentication page
│   └── Nav.tsx            # Navigation bar component
├── assets/                 # Static assets (images, icons)
├── App.tsx                # Root application component with routing
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
- **App.tsx** - Root component with Material-UI theming and React Router
- **Homepage.tsx** - Dashboard with project management and task overview
- **Login.tsx** - OAuth-style authentication with GitHub/Google integration
- **Nav.tsx** - Responsive navigation bar using Material-UI AppBar
- **Diagram.tsx** - Interactive flow diagram using ReactFlow with:
  - User task visualization
  - Automatic layout with Dagre
  - Dark/light theme toggle
  - Node interaction and details modal

## Routing Structure
- `/` - Homepage (dashboard)
- `/login` - Authentication page
- `/diagram` - Interactive flow diagram
- Catch-all redirect to homepage

## Styling Approach
- Material-UI components for consistent design system
- Emotion CSS-in-JS (MUI dependency) for component styling
- styled-components for additional custom styling
- Global CSS files for base styles
- Theme-aware styling with MUI ThemeProvider

## Key Patterns
- Multi-page application with React Router
- Component-based architecture with Material-UI
- TypeScript for type safety
- React hooks for state management
- Responsive design with Material-UI Grid system