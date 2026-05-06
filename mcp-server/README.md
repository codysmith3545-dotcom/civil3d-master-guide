# @civil3d-master-guide/mcp

A [Model Context Protocol](https://modelcontextprotocol.io) server that exposes the [Civil 3D Master Guide](../README.md) knowledge base as MCP tools so Claude Desktop, Claude Code, Cursor, Codex, and any MCP-aware client can search, fetch, and run engineering calculators against it.

## What's exposed

| Tool | Purpose |
| --- | --- |
| `get_page` | Fetch a single markdown page (frontmatter + raw body + sources) by slug. |
| `search_kb` | Token-overlap full-text search with frontmatter-tag boosts. |
| `list_commands` | Civil 3D command catalog (optionally filtered by frontmatter `category`). |
| `list_jurisdictions` | State/county/municipality pages under `content/jurisdictions/`. |
| `get_resource_index` | Curated outside-resource index (books, YouTube, blogs, forums, podcasts, training, tools). |
| `run_calculator` | `vertical_curve`, `horizontal_curve`, `rational_method`, `mannings_open_channel`, `state_plane_indiana_csf`. |

All calculator results include a `source` string citing the controlling reference (AASHTO Green Book, FHWA HEC-22, Chow, NAD83 SPC parameters, etc.).

## Install / run

Requires Node ≥ 18.

```bash
# Run directly from npm:
npx -y @civil3d-master-guide/mcp

# Or, after cloning the repo:
cd mcp-server
npm install
npm run build
node dist/index.js
```

## Locating the knowledge base

The server needs to find the repo's `content/` directory. It tries, in order:

1. `KB_ROOT` env var — must point at the repo root (the directory containing `content/`) **or** at `content/` itself.
2. Walking up from `process.cwd()`.
3. Walking up from the directory of the running binary.

When you `npx` the package outside a clone, set `KB_ROOT`:

```bash
KB_ROOT=/path/to/civil3d-master-guide npx -y @civil3d-master-guide/mcp
```

## Client setup

The server name is `civil3d-master-guide`. Pick the snippet that matches your client and paste it into the appropriate config file.

### Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "civil3d-master-guide": {
      "command": "npx",
      "args": ["-y", "@civil3d-master-guide/mcp"],
      "env": {
        "KB_ROOT": "/absolute/path/to/civil3d-master-guide"
      }
    }
  }
}
```

Local-dev variant (running from a clone, no npx):

```json
{
  "mcpServers": {
    "civil3d-master-guide": {
      "command": "node",
      "args": ["/absolute/path/to/civil3d-master-guide/mcp-server/dist/index.js"],
      "env": {
        "KB_ROOT": "/absolute/path/to/civil3d-master-guide"
      }
    }
  }
}
```

### Claude Code

`~/.claude.json` (user scope) or `.mcp.json` at your repo root (project scope):

```json
{
  "mcpServers": {
    "civil3d-master-guide": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@civil3d-master-guide/mcp"],
      "env": {
        "KB_ROOT": "/absolute/path/to/civil3d-master-guide"
      }
    }
  }
}
```

Local-dev variant:

```json
{
  "mcpServers": {
    "civil3d-master-guide": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/civil3d-master-guide/mcp-server/dist/index.js"],
      "env": {
        "KB_ROOT": "/absolute/path/to/civil3d-master-guide"
      }
    }
  }
}
```

You can also register it from the Claude Code CLI:

```bash
claude mcp add civil3d-master-guide -e KB_ROOT=/abs/path/to/civil3d-master-guide -- npx -y @civil3d-master-guide/mcp
```

### Cursor

`~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (per-project):

```json
{
  "mcpServers": {
    "civil3d-master-guide": {
      "command": "npx",
      "args": ["-y", "@civil3d-master-guide/mcp"],
      "env": {
        "KB_ROOT": "/absolute/path/to/civil3d-master-guide"
      }
    }
  }
}
```

Local-dev variant:

```json
{
  "mcpServers": {
    "civil3d-master-guide": {
      "command": "node",
      "args": ["/absolute/path/to/civil3d-master-guide/mcp-server/dist/index.js"],
      "env": {
        "KB_ROOT": "/absolute/path/to/civil3d-master-guide"
      }
    }
  }
}
```

## Build & verify

```bash
npm install
npm run build           # tsc -b → emits to dist/
node dist/index.js      # starts on stdio; needs an MCP client to talk to
```

Smoke-test the stdio handshake without a real client:

```bash
# List tools (one JSON-RPC line on stdin, response on stdout)
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"0"}}}' '{"jsonrpc":"2.0","method":"notifications/initialized","params":{}}' '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | KB_ROOT=$(pwd)/.. node dist/index.js
```

## Calculator references

- `vertical_curve` — AASHTO *A Policy on Geometric Design of Highways and Streets* (Green Book), 7th ed., 2018: Tables 3-34 (crest SSD), 3-36 (crest PSD), 3-37 (sag headlight), and §3.4 sag comfort `K = V²/46.5`.
- `horizontal_curve` — Standard circular-curve formulas (Wolf & Ghilani, *Elementary Surveying*).
- `rational_method` — `Q = C·i·A` (FHWA HEC-22, AASHTO Drainage Guidelines).
- `mannings_open_channel` — `V = (1.486/n)·R^(2/3)·S^(1/2)` (Chow, *Open-Channel Hydraulics*; FHWA HDS-5).
- `state_plane_indiana_csf` — NAD83 Indiana East 1301 / West 1302 TM parameters; combined scale factor approximation. **Design-stage only** — confirm with NGS NCAT for control-grade work.

## License

MIT.
