# dogshell-ts - Product Requirements Document

## Overview

**dogshell-ts** is a modern TypeScript CLI tool that wraps the Datadog API, providing a maintained alternative to the unmaintained Python-based `dogshell`. It focuses on core monitoring operations that engineers use daily.

## Goals

- Provide a fast, type-safe CLI for common Datadog operations
- Support modern CLI patterns (JSON output, piping, scripting)
- Easy installation via npm/npx
- Clear, consistent command structure

## Non-Goals

- Full API coverage (focusing on high-value operations only)
- Agent management

---

## API Scope

### 1. Core Monitoring

#### 1.1 Metrics

| Command | API Endpoint | Description |
|---------|--------------|-------------|
| `metrics submit` | `POST /api/v2/series` | Submit metric data points |
| `metrics query` | `GET /api/v1/query` | Query timeseries data |
| `metrics list` | `GET /api/v2/metrics` | List active metrics |
| `metrics metadata get` | `GET /api/v1/metrics/{metric_name}` | Get metric metadata |
| `metrics metadata update` | `PUT /api/v1/metrics/{metric_name}` | Update metric metadata |
| `metrics tags list` | `GET /api/v2/metrics/{metric_name}/tags` | List tags for a metric |
| `metrics tags update` | `PATCH /api/v2/metrics/{metric_name}/tags` | Update tags configuration |

#### 1.2 Service Checks

| Command | API Endpoint | Description |
|---------|--------------|-------------|
| `check submit` | `POST /api/v1/check_run` | Submit a service check |

#### 1.3 Hosts

| Command | API Endpoint | Description |
|---------|--------------|-------------|
| `hosts list` | `GET /api/v1/hosts` | List all hosts |
| `hosts totals` | `GET /api/v1/hosts/totals` | Get total host counts |
| `hosts mute` | `POST /api/v1/host/{host_name}/mute` | Mute a host |
| `hosts unmute` | `POST /api/v1/host/{host_name}/unmute` | Unmute a host |

#### 1.4 Tags

| Command | API Endpoint | Description |
|---------|--------------|-------------|
| `tags list` | `GET /api/v1/tags/hosts` | Get all host tags |
| `tags get` | `GET /api/v1/tags/hosts/{host_name}` | Get tags for a host |
| `tags add` | `POST /api/v1/tags/hosts/{host_name}` | Add tags to a host |
| `tags update` | `PUT /api/v1/tags/hosts/{host_name}` | Update host tags |
| `tags delete` | `DELETE /api/v1/tags/hosts/{host_name}` | Remove tags from host |

---

### 2. Dashboards & Visualization

#### 2.1 Dashboards

| Command | API Endpoint | Description |
|---------|--------------|-------------|
| `dashboard list` | `GET /api/v1/dashboard` | List all dashboards |
| `dashboard get` | `GET /api/v1/dashboard/{dashboard_id}` | Get dashboard definition |
| `dashboard create` | `POST /api/v1/dashboard` | Create a dashboard |
| `dashboard update` | `PUT /api/v1/dashboard/{dashboard_id}` | Update a dashboard |
| `dashboard delete` | `DELETE /api/v1/dashboard/{dashboard_id}` | Delete a dashboard |
| `dashboard export` | `GET /api/v1/dashboard/{dashboard_id}` | Export dashboard as JSON |
| `dashboard import` | `POST /api/v1/dashboard` | Import dashboard from JSON |

#### 2.2 Dashboard Lists

| Command | API Endpoint | Description |
|---------|--------------|-------------|
| `dashboard-list list` | `GET /api/v1/dashboard/lists/manual` | List all dashboard lists |
| `dashboard-list get` | `GET /api/v1/dashboard/lists/manual/{list_id}` | Get a dashboard list |
| `dashboard-list create` | `POST /api/v1/dashboard/lists/manual` | Create a dashboard list |
| `dashboard-list update` | `PUT /api/v1/dashboard/lists/manual/{list_id}` | Update a dashboard list |
| `dashboard-list delete` | `DELETE /api/v1/dashboard/lists/manual/{list_id}` | Delete a dashboard list |
| `dashboard-list items` | `GET /api/v2/dashboard/lists/manual/{list_id}/dashboards` | Get dashboards in list |
| `dashboard-list add` | `POST /api/v2/dashboard/lists/manual/{list_id}/dashboards` | Add dashboards to list |
| `dashboard-list remove` | `DELETE /api/v2/dashboard/lists/manual/{list_id}/dashboards` | Remove from list |

#### 2.3 Notebooks

| Command | API Endpoint | Description |
|---------|--------------|-------------|
| `notebook list` | `GET /api/v1/notebooks` | List all notebooks |
| `notebook get` | `GET /api/v1/notebooks/{notebook_id}` | Get notebook details |
| `notebook create` | `POST /api/v1/notebooks` | Create a notebook |
| `notebook update` | `PUT /api/v1/notebooks/{notebook_id}` | Update a notebook |
| `notebook delete` | `DELETE /api/v1/notebooks/{notebook_id}` | Delete a notebook |

---

### 3. Monitors & Alerting

#### 3.1 Monitors

| Command | API Endpoint | Description |
|---------|--------------|-------------|
| `monitor list` | `GET /api/v1/monitor` | List all monitors |
| `monitor get` | `GET /api/v1/monitor/{monitor_id}` | Get monitor details |
| `monitor create` | `POST /api/v1/monitor` | Create a monitor |
| `monitor update` | `PUT /api/v1/monitor/{monitor_id}` | Update a monitor |
| `monitor delete` | `DELETE /api/v1/monitor/{monitor_id}` | Delete a monitor |
| `monitor validate` | `POST /api/v1/monitor/validate` | Validate monitor definition |
| `monitor search` | `GET /api/v1/monitor/search` | Search monitors |
| `monitor mute` | `POST /api/v1/monitor/{monitor_id}/mute` | Mute a monitor |
| `monitor unmute` | `POST /api/v1/monitor/{monitor_id}/unmute` | Unmute a monitor |
| `monitor mute-all` | `POST /api/v1/monitor/mute_all` | Mute all monitors |
| `monitor unmute-all` | `POST /api/v1/monitor/unmute_all` | Unmute all monitors |

---

### 4. Logs

#### 4.1 Log Submission & Query

| Command | API Endpoint | Description |
|---------|--------------|-------------|
| `logs submit` | `POST /api/v2/logs` | Submit log entries |
| `logs list` | `POST /api/v2/logs/events/search` | Search/list logs |
| `logs aggregate` | `POST /api/v2/logs/analytics/aggregate` | Aggregate log data |

#### 4.2 Log Indexes

| Command | API Endpoint | Description |
|---------|--------------|-------------|
| `logs index list` | `GET /api/v1/logs/config/indexes` | List all log indexes |
| `logs index get` | `GET /api/v1/logs/config/indexes/{name}` | Get index details |
| `logs index update` | `PUT /api/v1/logs/config/indexes/{name}` | Update an index |
| `logs index order` | `GET /api/v1/logs/config/index-order` | Get index order |
| `logs index reorder` | `PUT /api/v1/logs/config/index-order` | Update index order |

#### 4.3 Log Pipelines

| Command | API Endpoint | Description |
|---------|--------------|-------------|
| `logs pipeline list` | `GET /api/v1/logs/config/pipelines` | List all pipelines |
| `logs pipeline get` | `GET /api/v1/logs/config/pipelines/{pipeline_id}` | Get pipeline details |
| `logs pipeline create` | `POST /api/v1/logs/config/pipelines` | Create a pipeline |
| `logs pipeline update` | `PUT /api/v1/logs/config/pipelines/{pipeline_id}` | Update a pipeline |
| `logs pipeline delete` | `DELETE /api/v1/logs/config/pipelines/{pipeline_id}` | Delete a pipeline |
| `logs pipeline order` | `GET /api/v1/logs/config/pipeline-order` | Get pipeline order |
| `logs pipeline reorder` | `PUT /api/v1/logs/config/pipeline-order` | Update pipeline order |

#### 4.4 Log Archives

| Command | API Endpoint | Description |
|---------|--------------|-------------|
| `logs archive list` | `GET /api/v2/logs/config/archives` | List all archives |
| `logs archive get` | `GET /api/v2/logs/config/archives/{archive_id}` | Get archive details |
| `logs archive create` | `POST /api/v2/logs/config/archives` | Create an archive |
| `logs archive update` | `PUT /api/v2/logs/config/archives/{archive_id}` | Update an archive |
| `logs archive delete` | `DELETE /api/v2/logs/config/archives/{archive_id}` | Delete an archive |
| `logs archive order` | `GET /api/v2/logs/config/archive-order` | Get archive order |
| `logs archive reorder` | `PUT /api/v2/logs/config/archive-order` | Update archive order |

---

## CLI Design

### Authentication

```bash
# Config file (~/.dogrc)
# YAML format:
# api_key: your-api-key
# app_key: your-app-key
# site: datadoghq.com

# Or environment variables (override .dogrc)
export DD_API_KEY="your-api-key"
export DD_APP_KEY="your-app-key"
export DD_SITE="datadoghq.com"  # or datadoghq.eu, us3.datadoghq.com, etc.

# Configure via CLI
dog config set api_key <key>
dog config set app_key <key>
dog config set site <site>
```

### Output Formats

```bash
# Default: human-readable table/text
dog monitor list

# JSON output for scripting
dog monitor list --json

# Quiet mode (IDs only)
dog monitor list --quiet
```

### Common Flags

| Flag | Description |
|------|-------------|
| `--json` | Output as JSON |
| `--quiet, -q` | Minimal output (IDs only) |
| `--dry-run` | Preview without executing |
| `--help, -h` | Show help |
| `--version, -v` | Show version |

### Example Usage

```bash
# Submit a metric
dog metrics submit --metric "custom.metric" --value 42 --tags "env:prod,service:api"

# Query metrics
dog metrics query --query "avg:system.cpu.user{*}" --from "-1h"

# Create a monitor from JSON
dog monitor create --file monitor.json

# Export a dashboard
dog dashboard export abc-123-def > dashboard.json

# Search logs
dog logs list --query "service:api status:error" --from "-15m" --limit 100

# List hosts
dog hosts list --filter "env:production"
```

---

## Technical Requirements

### Stack

- **Language**: TypeScript
- **Runtime**: Node.js >= 18
- **CLI Framework**: Pastel (built on Ink)
- **UI Rendering**: Ink (React for CLI)
- **HTTP Client**: Native fetch
- **Config**: YAML (~/.dogrc)

This stack is chosen to enable a future TUI mode while providing a solid CLI experience today. Ink's React-based rendering makes it easy to add interactive features later.

### Package Distribution

- npm package: `dogshell-ts`
- Executable: `dog`

### Error Handling

- Clear error messages with API error details
- Exit codes: 0 (success), 1 (error), 2 (invalid usage)
- Retry logic for rate limits (429 responses)

---

## Command Summary

| Category | Commands |
|----------|----------|
| **Metrics** | 7 commands |
| **Service Checks** | 1 command |
| **Hosts** | 4 commands |
| **Tags** | 5 commands |
| **Dashboards** | 7 commands |
| **Dashboard Lists** | 8 commands |
| **Notebooks** | 5 commands |
| **Monitors** | 11 commands |
| **Logs** | 3 commands |
| **Log Indexes** | 5 commands |
| **Log Pipelines** | 7 commands |
| **Log Archives** | 7 commands |
| **Total** | **70 commands** |

---

## Milestones

### v0.1.0 - MVP
- Authentication & configuration (~/.dogrc)
- Metrics: submit, query
- Monitors: list, get, create, mute/unmute
- Dashboards: list, get, export

### v0.2.0 - Core Complete
- Full Metrics API
- Full Hosts/Tags API
- Service Checks

### v0.3.0 - Dashboards Complete
- Full Dashboards API
- Dashboard Lists
- Notebooks

### v0.4.0 - Alerting Complete
- Full Monitors API

### v1.0.0 - Full Release
- Full Logs API
- Comprehensive documentation
- Shell completions
- Stable API

### Future (post-1.0)
- TUI mode (`dog --tui` or `dog ui`)
- Interactive monitor builder
- Live log tailing with filters
- Dashboard viewer
