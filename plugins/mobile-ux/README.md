# Mobile UX Plugin for Claude Code

Expert plugin for analyzing and optimizing Next.js applications for mobile UX. Transforms web apps into native-like mobile experiences.

## Features

- **Full Mobile Audit**: Analyzes entire application for mobile UX issues
- **Native-like Feel**: Transforms UI to feel like a native mobile app
- **Universal Support**: Works with any CSS framework (Tailwind, SCSS, styled-components)
- **PWA Optimization**: Service workers, offline mode, install prompts
- **Touch Interactions**: Swipe gestures, haptic feedback, pull-to-refresh
- **Thumb Zone Optimization**: Ensures reachability for one-handed use

## Components

### Skills
- `mobile-ux-patterns` - Expert knowledge on mobile UX patterns, touch interactions, native-like UI
- `pwa-optimization` - PWA best practices, service workers, offline capabilities

### Agents
- `mobile-ux-expert` - Autonomous agent for analyzing and fixing mobile UX issues

### Commands
- `/mobile-audit` - Run full mobile UX audit on your application

## Installation

```bash
claude --plugin-dir /path/to/mobile-ux
```

Or add to your Claude Code plugins configuration.

## Usage

### Run Mobile Audit
```
/mobile-audit
```

The agent will:
1. Scan all pages and components
2. Identify mobile UX issues
3. Generate detailed report with priorities
4. Ask before implementing fixes

### Automatic Suggestions
When working on UI components, the plugin provides expert guidance on:
- Touch-friendly sizing (min 44px tap targets)
- Safe area handling (notch, home indicator)
- Mobile typography and spacing
- Gesture interactions
- Performance optimizations

## License

MIT
