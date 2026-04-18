SYSTEM PROMPT: TypeScript Simple Browser Development Task

OBJECTIVE:
Design and build a simple React + TypeScript mobile browser application.

CORE REQUIREMENTS:
1. TypeScript Configuration
   - Strict TypeScript enabled
   - Proper type definitions for all components
   - Interface definitions for props and state

2. Browser Components (TypeScript)
   - App.tsx - Main application component with typed state
   - components/BrowserFrame.tsx - Iframe/WebView wrapper with types
   - components/AddressBar.tsx - URL input with typed props
   - components/Navigation.tsx - Back/Forward/Reload buttons
   - components/Dashboard.tsx - Metrics display with typed data
   - types/index.ts - All TypeScript interfaces

3. Browser Features
   - URL navigation with history tracking
   - Back/Forward buttons (disabled state management)
   - Refresh button
   - Address bar with validation
   - Page load metrics (load time, success/failure)
   - Simple dashboard showing: pages loaded, session duration, current URL

4. Technical Stack
   - React 18 with TypeScript
   - Vite or Create React App
   - No external UI libraries (pure CSS/Tailwind optional)
   - Functional components with hooks (useState, useCallback, useRef)

OUTPUT:
Create in /home/dell/.openclaw/workspace/simple-browser-ts/:
- src/App.tsx
- src/components/BrowserFrame.tsx
- src/components/AddressBar.tsx
- src/components/Navigation.tsx
- src/components/Dashboard.tsx
- src/types/index.ts
- src/hooks/useBrowser.ts (custom hook for browser logic)
- package.json
- tsconfig.json
- index.html
- README.md

QUALITY STANDARDS:
- 100% TypeScript coverage (no `any` types)
- Clean component architecture
- Proper error boundaries
- Comments explaining complex types
- Working demo (npm run dev should start the browser)

DELIVERABLE:
Working TypeScript browser app that:
- Loads example.com or wikipedia.org
- Tracks navigation history
- Shows metrics in dashboard
- Has no type errors (tsc --noEmit passes)

AGENT WORKFLOW:
1. Coder agent: Write all TypeScript files with proper types
2. TypeChecker agent: Run tsc to verify no type errors
3. Reviewer agent: Verify architecture and functionality
4. Do not claim completion until files exist and tsc passes
