# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**dogshell-ts** is a modern TypeScript CLI tool that wraps the Datadog API. It's a maintained alternative to the unmaintained Python-based `dogshell`, focusing on core monitoring operations.

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js >= 18
- **CLI Framework**: Pastel (built on Ink)
- **UI Rendering**: Ink (React for CLI)
- **HTTP Client**: Native fetch
- **Config**: YAML (~/.dogrc)

## Project Structure

```
src/
  commands/     # Pastel command components
  components/   # Reusable Ink UI components
  lib/          # Core library (API client, config)
  types/        # TypeScript type definitions
docs/
  prd.md        # Product requirements document
  tasks.md      # Development task breakdown
```

## Key Commands

```bash
# Development
npm run dev         # Run in development mode
npm run build       # Build for production
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript type checking

# Testing
npm test            # Run tests
```

## Architecture Notes

### Configuration
- Config file: `~/.dogrc` (YAML format)
- Environment variables override config: `DD_API_KEY`, `DD_APP_KEY`, `DD_SITE`
- Config fields: `api_key`, `app_key`, `site`

### API Client
- Base URL constructed from `site` config (e.g., `api.datadoghq.com`, `api.datadoghq.eu`)
- All requests include `DD-API-KEY` and `DD-APPLICATION-KEY` headers
- Rate limit handling with exponential backoff on 429 responses

### Command Structure
- Commands follow pattern: `dog <resource> <action> [args] [flags]`
- Examples: `dog metrics submit`, `dog monitor list`, `dog dashboard export`
- Global flags: `--json` (JSON output), `--quiet` (minimal output)

## API Scope

The CLI covers four main areas:
1. **Core Monitoring**: Metrics, Events, Hosts, Service Checks
2. **Dashboards**: Dashboards, Dashboard Lists, Notebooks
3. **Monitors & Alerting**: Monitors, Downtimes, SLOs
4. **Logs**: Log submission/search, Indexes, Pipelines, Archives

See `docs/prd.md` for full API endpoint mapping.

## Development Guidelines

1. **Commands**: Each command is a React component using Ink/Pastel
2. **Types**: Define request/response types in `src/types/`
3. **API Methods**: Add to `DatadogClient` class in `src/lib/client.ts`
4. **Error Handling**: Use custom error classes, display with Ink components
5. **Output**: Support both human-readable (default) and JSON (`--json`) formats
