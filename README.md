# Bomoge Claude Code Plugins

Community plugins for [Claude Code](https://claude.ai/code) - Anthropic's official CLI for Claude.

## Available Plugins

| Plugin | Description | Category |
|--------|-------------|----------|
| [seo-dev](./plugins/seo-dev) | Comprehensive SEO analysis and optimization | Analysis |
| [prod-ready](./plugins/prod-ready) | Production readiness checker (security, performance, UI/UX, accessibility) | Audit |
| [mobile-ux](./plugins/mobile-ux) | Mobile UX analysis and optimization, transforms web apps into native-like experiences | Mobile |

## Installation

### Option 1: Install specific plugin

```bash
# Clone the repository
git clone https://github.com/pr0d5h381/bomoge-claude-code-plugins.git

# Symlink plugin to your Claude plugins directory
ln -s /path/to/bomoge-claude-code-plugins/plugins/seo-dev ~/.claude/plugins/seo-dev

# Or use in specific project
ln -s /path/to/bomoge-claude-code-plugins/plugins/seo-dev /your/project/.claude-plugin
```

### Option 2: Use with --plugin-dir

```bash
claude --plugin-dir /path/to/bomoge-claude-code-plugins/plugins/seo-dev
```

## Plugin Categories

- **Analysis & Optimization** - SEO, performance, code quality
- **Mobile & UX** - Mobile optimization, native-like experiences, PWA
- **Development Tools** - Workflows, testing, automation
- **Integrations** - External services, APIs

## Creating a New Plugin

### 1. Create plugin structure

```bash
mkdir -p plugins/your-plugin/.claude-plugin
mkdir -p plugins/your-plugin/{commands,agents,skills,hooks}
```

### 2. Create plugin.json manifest

```json
{
  "name": "your-plugin",
  "version": "1.0.0",
  "description": "What your plugin does",
  "author": {
    "name": "Your Name"
  }
}
```

### 3. Add components

- **Commands** (`commands/*.md`) - User-invoked slash commands
- **Agents** (`agents/*.md`) - Autonomous task handlers
- **Skills** (`skills/*/SKILL.md`) - Domain knowledge and procedures
- **Hooks** (`hooks/hooks.json`) - Event-driven automation

### 4. Update marketplace.json

Add your plugin entry to `marketplace.json`:

```json
{
  "name": "your-plugin",
  "version": "1.0.0",
  "description": "Description",
  "path": "plugins/your-plugin",
  "category": "development",
  "tags": ["tag1", "tag2"]
}
```

### 5. Create pull request

Submit a PR with your plugin for review.

## Plugin Structure

```
plugins/your-plugin/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest (required)
├── commands/                 # Slash commands
│   └── command-name.md
├── agents/                   # Autonomous agents
│   └── agent-name.md
├── skills/                   # Knowledge and procedures
│   └── skill-name/
│       ├── SKILL.md
│       └── references/
├── hooks/                    # Event handlers
│   └── hooks.json
├── scripts/                  # Utility scripts
└── README.md                 # Plugin documentation
```

## Contributing

1. Fork this repository
2. Create your plugin in `plugins/your-plugin-name/`
3. Update `marketplace.json`
4. Submit a pull request

### Guidelines

- Follow Claude Code plugin conventions
- Include comprehensive README in your plugin
- Test thoroughly before submitting
- Use semantic versioning

## License

MIT License - see individual plugins for their licenses.

---

Made with Claude Code
