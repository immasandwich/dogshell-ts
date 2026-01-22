# dogshell-ts - Development Tasks

This document breaks down the project into small, incremental tasks. Each task should be completable in a focused session and builds toward the final product.

---

## Phase 0: Project Setup

### 0.1 Initialize Project
- [ ] Initialize npm project with `package.json`
- [ ] Configure TypeScript (`tsconfig.json`)
- [ ] Set up ESLint and Prettier
- [ ] Add `.gitignore`
- [ ] Create basic directory structure:
  ```
  src/
    commands/
    components/
    lib/
    types/
  ```

### 0.2 Install Dependencies
- [ ] Install Ink and React (`ink`, `react`)
- [ ] Install Pastel (`@anthropic-ai/pastel` or build from source)
- [ ] Install YAML parser (`yaml`)
- [ ] Install dev dependencies (TypeScript, types, build tools)

### 0.3 Build Configuration
- [ ] Set up build script (tsc or tsup)
- [ ] Configure executable entry point in `package.json` (`bin` field)
- [ ] Test that `dog --help` runs

---

## Phase 1: Foundation

### 1.1 Configuration & API Client
- [ ] Create `Config` type definition
- [ ] Implement `loadConfig()` - reads `~/.dogrc` (YAML)
- [ ] Implement `saveConfig()` - writes `~/.dogrc`
- [ ] Support environment variable overrides (`DD_API_KEY`, `DD_APP_KEY`, `DD_SITE`)
- [ ] Add config validation (required fields, valid site URLs)
- [ ] Create `DatadogClient` class
- [ ] Implement base request method with:
  - Authentication headers (`DD-API-KEY`, `DD-APPLICATION-KEY`)
  - Site-aware base URL construction
  - JSON parsing
  - Error handling
- [ ] Add request/response type definitions
- [ ] Implement rate limit handling (429 retry with backoff)

---

## Phase 2: Core Monitoring - Metrics

### 2.1 Metrics Submit
- [ ] Define `MetricSubmission` type
- [ ] Implement `POST /api/v2/series` in client
- [ ] Create `dog metrics submit` command
- [ ] Parse flags: `--metric`, `--value`, `--tags`, `--timestamp`, `--type`
- [ ] Support reading from stdin (for batch submissions)
- [ ] Add success/error output

### 2.2 Metrics Metadata
- [ ] Implement `GET /api/v1/metrics/{metric_name}` in client
- [ ] Implement `PUT /api/v1/metrics/{metric_name}` in client
- [ ] Create `dog metrics metadata get <metric>` command
- [ ] Create `dog metrics metadata update <metric>` command
- [ ] Parse flags for update: `--description`, `--unit`, `--type`

### 2.3 Metrics Tags
- [ ] Implement `GET /api/v2/metrics/{metric_name}/tags` in client
- [ ] Implement `PATCH /api/v2/metrics/{metric_name}/tags` in client
- [ ] Create `dog metrics tags list <metric>` command
- [ ] Create `dog metrics tags update <metric>` command

---

## Phase 3: Core Monitoring - Events & Hosts

### 3.1 Events Post
- [ ] Define `Event` type
- [ ] Implement `POST /api/v1/events` in client
- [ ] Create `dog events post` command
- [ ] Parse flags: `--title`, `--text`, `--tags`, `--priority`, `--alert-type`
- [ ] Support `--file` for reading event text from file

### 3.2 Hosts List
- [ ] Define `Host` type
- [ ] Implement `GET /api/v1/hosts` in client
- [ ] Create `dog hosts list` command
- [ ] Parse flags: `--filter`, `--sort`, `--from`
- [ ] Display host table with key info

### 3.3 Service Checks
- [ ] Define `ServiceCheck` type
- [ ] Implement `POST /api/v1/check_run` in client
- [ ] Create `dog check submit` command
- [ ] Parse flags: `--check`, `--host`, `--status`, `--message`, `--tags`

---

## Phase 4: Monitors

### 4.1 Monitor Types & Client
- [ ] Define `Monitor`, `MonitorOptions`, `MonitorSearchResult` types
- [ ] Implement all monitor endpoints in client

### 4.2 Monitor List & Get
- [ ] Create `dog monitor list` command
- [ ] Parse flags: `--tags`, `--name`, `--type`
- [ ] Create `dog monitor get <monitor_id>` command
- [ ] Format monitor details output

### 4.3 Monitor Create & Update
- [ ] Create `dog monitor create` command
- [ ] Support `--file` for JSON definition
- [ ] Support inline flags for simple monitors
- [ ] Create `dog monitor update <monitor_id>` command
- [ ] Support partial updates via flags

### 4.4 Monitor Delete & Validate
- [ ] Create `dog monitor delete <monitor_id>` command
- [ ] Add `--force` flag to skip confirmation
- [ ] Create `dog monitor validate` command
- [ ] Support `--file` for JSON definition

### 4.5 Monitor Search
- [ ] Create `dog monitor search` command
- [ ] Parse flags: `--query`, `--page`, `--per-page`

### 4.6 Monitor Mute/Unmute
- [ ] Create `dog monitor mute <monitor_id>` command
- [ ] Create `dog monitor unmute <monitor_id>` command
- [ ] Create `dog monitor mute-all` command
- [ ] Create `dog monitor unmute-all` command
- [ ] Parse flags: `--scope`, `--end`

---

## Phase 5: Dashboards

### 5.1 Dashboard Types & Client
- [ ] Define `Dashboard`, `Widget`, `DashboardSummary` types
- [ ] Implement all dashboard endpoints in client

### 5.2 Dashboard List & Get
- [ ] Create `dog dashboard list` command
- [ ] Parse flags: `--filter`
- [ ] Create `dog dashboard get <dashboard_id>` command

### 5.3 Dashboard Create & Update
- [ ] Create `dog dashboard create` command
- [ ] Require `--file` for JSON definition
- [ ] Create `dog dashboard update <dashboard_id>` command

### 5.4 Dashboard Delete
- [ ] Create `dog dashboard delete <dashboard_id>` command
- [ ] Add `--force` flag

### 5.5 Dashboard Export & Import
- [ ] Create `dog dashboard export <dashboard_id>` command
- [ ] Output clean JSON (suitable for re-import)
- [ ] Create `dog dashboard import` command
- [ ] Read from `--file` or stdin

### 5.6 Dashboard Lists
- [ ] Implement dashboard list endpoints in client
- [ ] Create `dog dashboard-list list` command
- [ ] Create `dog dashboard-list get <list_id>` command
- [ ] Create `dog dashboard-list create` command
- [ ] Create `dog dashboard-list update <list_id>` command
- [ ] Create `dog dashboard-list delete <list_id>` command
- [ ] Create `dog dashboard-list items <list_id>` command
- [ ] Create `dog dashboard-list add <list_id> <dashboard_ids...>` command
- [ ] Create `dog dashboard-list remove <list_id> <dashboard_ids...>` command

### 5.7 Notebooks
- [ ] Implement notebook endpoints in client
- [ ] Create `dog notebook list` command
- [ ] Create `dog notebook get <notebook_id>` command
- [ ] Create `dog notebook create` command
- [ ] Create `dog notebook update <notebook_id>` command
- [ ] Create `dog notebook delete <notebook_id>` command

---

## Phase 6: Downtimes & SLOs

### 6.1 Downtime Types & Client
- [ ] Define `Downtime` types
- [ ] Implement all downtime endpoints in client (v2 API)

### 6.2 Downtime Commands
- [ ] Create `dog downtime list` command
- [ ] Create `dog downtime get <downtime_id>` command
- [ ] Create `dog downtime create` command
- [ ] Parse flags: `--scope`, `--message`, `--start`, `--end`, `--duration`, `--monitor-id`
- [ ] Create `dog downtime update <downtime_id>` command
- [ ] Create `dog downtime cancel <downtime_id>` command

### 6.3 SLO Types & Client
- [ ] Define `SLO`, `SLOHistory` types
- [ ] Implement all SLO endpoints in client

### 6.4 SLO Commands
- [ ] Create `dog slo list` command
- [ ] Create `dog slo get <slo_id>` command
- [ ] Create `dog slo create` command
- [ ] Create `dog slo update <slo_id>` command
- [ ] Create `dog slo delete <slo_id>` command
- [ ] Create `dog slo history <slo_id>` command
- [ ] Parse flags: `--from`, `--to`

### 6.5 SLO Correction Commands
- [ ] Define `SLOCorrection` types
- [ ] Implement SLO correction endpoints in client
- [ ] Create `dog slo-correction list` command
- [ ] Create `dog slo-correction get <correction_id>` command
- [ ] Create `dog slo-correction create` command
- [ ] Create `dog slo-correction update <correction_id>` command
- [ ] Create `dog slo-correction delete <correction_id>` command

---

## Phase 7: Logs

### 7.1 Logs Client & Types
- [ ] Define `LogEntry`, `LogSearchResult`, `LogAggregation` types
- [ ] Implement log submission endpoint (v2)
- [ ] Implement log search endpoint (v2)
- [ ] Implement log aggregate endpoint (v2)

### 7.2 Core Log Commands
- [ ] Create `dog logs submit` command
- [ ] Support stdin for log entries
- [ ] Parse flags: `--message`, `--service`, `--source`, `--tags`, `--hostname`
- [ ] Create `dog logs list` command
- [ ] Parse flags: `--query`, `--from`, `--to`, `--limit`
- [ ] Create `dog logs aggregate` command

### 7.3 Log Indexes
- [ ] Implement log index endpoints in client
- [ ] Create `dog logs index list` command
- [ ] Create `dog logs index get <name>` command
- [ ] Create `dog logs index update <name>` command
- [ ] Create `dog logs index order` command
- [ ] Create `dog logs index reorder` command

### 7.4 Log Pipelines
- [ ] Implement log pipeline endpoints in client
- [ ] Create `dog logs pipeline list` command
- [ ] Create `dog logs pipeline get <pipeline_id>` command
- [ ] Create `dog logs pipeline create` command
- [ ] Create `dog logs pipeline update <pipeline_id>` command
- [ ] Create `dog logs pipeline delete <pipeline_id>` command
- [ ] Create `dog logs pipeline order` command
- [ ] Create `dog logs pipeline reorder` command

### 7.5 Log Archives
- [ ] Implement log archive endpoints in client (v2)
- [ ] Create `dog logs archive list` command
- [ ] Create `dog logs archive get <archive_id>` command
- [ ] Create `dog logs archive create` command
- [ ] Create `dog logs archive update <archive_id>` command
- [ ] Create `dog logs archive delete <archive_id>` command
- [ ] Create `dog logs archive order` command
- [ ] Create `dog logs archive reorder` command

### 7.6 Log-based Metrics
- [ ] Implement log metrics endpoints in client (v2)
- [ ] Create `dog logs metric list` command
- [ ] Create `dog logs metric get <metric_id>` command
- [ ] Create `dog logs metric create` command
- [ ] Create `dog logs metric update <metric_id>` command
- [ ] Create `dog logs metric delete <metric_id>` command

---

## Phase 8: Polish & Release

### 8.1 Documentation
- [ ] Write README.md with installation and quick start
- [ ] Add usage examples for common workflows
- [ ] Document all commands with `--help`
- [ ] Add CHANGELOG.md

### 8.2 Testing
- [ ] Set up test framework (Vitest or Jest)
- [ ] Add unit tests for config loading
- [ ] Add unit tests for API client
- [ ] Add integration tests for key commands (with mocked API)

### 8.3 CI/CD
- [ ] Set up GitHub Actions for CI
- [ ] Add linting and type-checking to CI
- [ ] Add test running to CI
- [ ] Set up npm publish workflow

### 8.4 Shell Completions
- [ ] Generate bash completions
- [ ] Generate zsh completions
- [ ] Generate fish completions
- [ ] Document completion installation

### 8.5 Final Release Prep
- [ ] Audit all commands for consistency
- [ ] Review error messages for clarity
- [ ] Test on Linux, macOS, Windows
- [ ] Publish v1.0.0 to npm

---

## Future Tasks (Post-1.0)

### TUI Mode
- [ ] Design TUI layout and navigation
- [ ] Implement main menu
- [ ] Implement monitor list view with live updates
- [ ] Implement log viewer with filtering
- [ ] Implement dashboard selector

### Interactive Features
- [ ] Interactive monitor builder wizard
- [ ] Interactive downtime scheduler
- [ ] Live log tailing (`dog logs tail`)

---

## Task Dependencies

```
Phase 0 (Setup)
    └── Phase 1 (Foundation)
            ├── Phase 2 (Metrics)
            ├── Phase 3 (Events & Hosts)
            ├── Phase 4 (Monitors)
            ├── Phase 5 (Dashboards)
            ├── Phase 6 (Downtimes/SLOs)
            └── Phase 7 (Logs)
                    └── Phase 8 (Polish)
```

Phases 2-7 can be worked on in parallel once Phase 1 is complete.
