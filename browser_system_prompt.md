SYSTEM PROMPT: Simple Mobile Browser Development Task

OBJECTIVE:
Design and build a simple React Native mobile browser application with the following specifications:

CORE REQUIREMENTS:
1. WebView Component
   - Implement react-native-webview for rendering web pages
   - Support navigation to any valid URL
   - Handle HTTP/HTTPS protocols

2. Navigation Controls
   - Back button (←) to navigate to previous page
   - Forward button (→) to navigate to next page  
   - Refresh/Reload button to reload current page
   - Disable buttons appropriately when navigation not possible

3. Address Bar
   - TextInput field for URL entry
   - Auto-prefix https:// if not provided
   - Submit on enter/return key
   - Display current URL

4. Basic History Tracking
   - Track visited URLs in session
   - Persist navigation state

TECHNICAL STACK:
- React Native with TypeScript
- Expo framework
- react-native-webview dependency
- @react-navigation/native for screen management

OUTPUT:
Create the following files in /home/dell/.openclaw/workspace/simple-browser/:
1. App.tsx - Main application with WebView and navigation
2. package.json - Dependencies and scripts
3. README.md - Setup and usage instructions

QUALITY STANDARDS:
- Clean, readable code with comments
- Proper error handling
- TypeScript type safety
- Functional components with hooks
- Tested navigation flow works end-to-end

DELIVERABLE:
Working browser app that can:
- Load google.com or any URL
- Navigate back/forward through history
- Refresh pages
- Enter new URLs in address bar

AGENT WORKFLOW:
1. Coder agent: Write all three files
2. Reviewer agent: Verify code compiles and logic is correct
3. Do not claim completion until files exist and are verified
