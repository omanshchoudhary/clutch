```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║      ██████╗██╗     ██╗   ██╗████████╗ ██████╗██╗  ██╗     ║
║     ██╔════╝██║     ██║   ██║╚══██╔══╝██╔════╝██║  ██║     ║
║     ██║     ██║     ██║   ██║   ██║   ██║     ███████║     ║
║     ██║     ██║     ██║   ██║   ██║   ██║     ██╔══██║     ║
║     ╚██████╗███████╗╚██████╔╝   ██║   ╚██████╗██║  ██║     ║
║      ╚═════╝╚══════╝ ╚═════╝    ╚═╝    ╚═════╝╚═╝  ╚═╝     ║
║                                                            ║
║                   Online IDE  ·  v1.0                      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

A fast, lightweight code playground with multi-language support, real-time execution, and a VS Code-inspired experience — right in your browser.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Configuration](#configuration)
7. [Usage](#usage)
8. [Keyboard Shortcuts](#keyboard-shortcuts)
9. [Supported Languages](#supported-languages)
10. [API Reference](#api-reference)
11. [What's Next](#whats-next)
12. [Contributing](#contributing)
13. [License](#license)

---

## Overview

Clutch is a browser-based code playground built for developers who want a fast, familiar environment without any local setup. It uses Monaco Editor (the same engine that powers VS Code) and executes code in real time via the Judge0 API.

**v1.0 ships with:**

- A full multi-file editor with folder organization
- Session persistence across page reloads
- Color-coded output with execution metadata
- Light and dark themes
- A hardened backend proxy with rate limiting and input validation

---

## Features

### Editor & Workspace

- **Monaco Editor** — syntax highlighting, IntelliSense, bracket matching, and smooth caret animation out of the box
- **Multi-file tabs** — open, switch between, rename, and close multiple files; unsaved changes are indicated with a dot
- **File explorer sidebar** — organize files into nested folders; create, rename, delete files and folders via sidebar buttons or right-click context menu
- **Language auto-detection** — language mode is set automatically from the file extension (`.py` → Python, `.cpp` → C++, etc.)
- **Toggle sidebar** — collapse/expand the file explorer to give the editor more room

### Session & Persistence

- **Auto-save** — files, folder structure, and active file are saved to `localStorage` every 5 seconds and on page unload
- **Session restore** — the full workspace is restored on next visit with no manual action needed
- **Clear Session** — wipe all files and reset the playground to defaults

### Execution & Output

- **Run code** — submits the active file to Judge0 via the Express backend; stdin is passed from the Input panel
- **Color-coded output** — stdout in default text, stderr in red, compile errors in orange
- **Execution metadata** — time and memory usage displayed after each run
- **Status badge** — shows Accepted, Runtime Error, Compilation Error, Time Limit Exceeded, etc.
- **Copy & Clear output** — one-click copy to clipboard, one-click clear

### Theme

- **Dark theme** (default) — VS Code Dark+ inspired palette
- **Light theme** — clean, high-contrast light variant
- **No flash on load** — theme is applied before first paint from `localStorage`

### Export

- **ZIP export** — download all files in the current workspace as `project.zip` via JSZip

### Security (Backend)

- **CORS allowlist** — requests only accepted from configured origins; null-origin requests are blocked
- **Rate limiting** — 30 requests per minute per IP on `/api/execute`
- **Input validation** — `language_id` checked against an allowlist of 9 IDs; `source_code` capped at 100 KB; `stdin` capped at 10 KB
- **Request size limit** — body parser rejects payloads over 200 KB
- **Request logging** — timestamp, IP, language, status, and duration logged on every request

---

## Tech Stack

**Frontend**

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Markup     | HTML5                             |
| Styling    | CSS3 with CSS Variables (theming) |
| Logic      | Vanilla JavaScript (ES6 modules)  |
| Editor     | Monaco Editor v0.45.0 (CDN)       |
| Icons      | Material Symbols Outlined (CDN)   |
| ZIP export | JSZip v3.10.1 (CDN)               |
| Storage    | `localStorage`                    |

**Backend**

| Layer          | Technology             |
| -------------- | ---------------------- |
| Runtime        | Node.js ≥ 18           |
| Framework      | Express 5              |
| HTTP client    | Axios                  |
| Rate limiting  | express-rate-limit     |
| Code execution | Judge0 CE via RapidAPI |
| Environment    | dotenv                 |

---

## Project Structure

```
clutch/
├── backend/
│   ├── server.js               # Express proxy — CORS, rate limit, validation, Judge0 relay
│   ├── package.json            # Backend dependencies
│   ├── .env                    # Environment variables (not committed)
│   └── .env.example            # Template for environment setup
│
├── frontend/
│   ├── index.html              # Main HTML document
│   ├── assets/
│   │   └── file-icons/         # SVG icons for each language (c, cpp, csharp, go, java, js, python, rust, ts, file)
│   ├── css/
│   │   ├── themes.css          # CSS variables for dark and light themes
│   │   └── styles.css          # All component and layout styles
│   └── js/
│       ├── ui-icons.js         # Icon registry and DOM hydration
│       ├── themes.js           # Theme manager (apply, persist, toggle)
│       ├── editor.js           # Monaco editor setup and public API
│       ├── api.js              # Language ID mapping and Judge0 fetch logic
│       ├── app.js              # Run button, output rendering, sidebar toggle
│       ├── shortcuts.js        # Keyboard shortcut bindings
│       ├── storage.js          # localStorage read/write/clear
│       └── files/
│           ├── state.js        # File and folder state (create, rename, delete, persist)
│           ├── render.js       # Tab bar and sidebar DOM rendering
│           ├── events.js       # Tab, sidebar, and top-action event bindings
│           ├── exporter.js     # ZIP export logic
│           └── helpers.js      # File icons, language detection, ID generation, sanitization
│
├── .gitignore
└── README.md
```

---

## Getting Started

**Requirements**

- Node.js v18+
- npm
- A Judge0 RapidAPI key ([get one here](https://rapidapi.com/judge0-official/api/judge0-ce))

**Install**

```bash
git clone <repository-url>
cd clutch/backend
npm install
```

**Configure**

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
JUDGE0_KEY=your_rapidapi_key_here
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

`ALLOWED_ORIGINS` accepts a comma-separated list. The backend automatically mirrors `localhost` ↔ `127.0.0.1` entries so you don't need to list both.

**Run**

```bash
# Start the backend
cd backend
npm run dev

# Open the frontend
# Open frontend/index.html with a local server (e.g. VS Code Live Server)
```

The playground will be available at `http://localhost:5500` (or your local server port).

---

## Configuration

| Variable          | Default                     | Description                                  |
| ----------------- | --------------------------- | -------------------------------------------- |
| `PORT`            | `3000`                      | Port the Express server listens on           |
| `JUDGE0_KEY`      | —                           | Your RapidAPI key for Judge0 CE              |
| `ALLOWED_ORIGINS` | `http://localhost:5501,...` | Comma-separated list of allowed CORS origins |

---

## Usage

### Running Code

1. Create or open a file in the tab bar or file explorer
2. Write your code in the Monaco editor
3. Add any stdin in the **Input** panel
4. Click **Run** or press `Ctrl+Enter` / `Cmd+Enter`
5. Output, errors, and execution stats appear in the **Output** panel

### Managing Files

- Click **+** in the tab bar or the **New File** icon in the sidebar to create a file — the language is set from the extension you give it
- Double-click a tab or right-click → **Rename** to rename a file
- Right-click a tab or sidebar item → **Delete** to remove it
- Use the sidebar **New Folder** button to create folders; files can be created directly inside them

### Themes

Click the sun/moon icon in the header to toggle between dark and light themes. The preference is saved and restored on next visit.

### Exporting

Click **Export** to download all open files as `project.zip`.

### Resetting

Click **Clear Session** to wipe all files and return the playground to its default state (a single `main.cpp` with a Hello World example).

---

## Keyboard Shortcuts

| Shortcut                   | Action                                |
| -------------------------- | ------------------------------------- |
| `Ctrl+Enter` / `Cmd+Enter` | Run the current file                  |
| `Ctrl+S` / `Cmd+S`         | Save session to localStorage          |
| `Ctrl+L` / `Cmd+L`         | Clear the output panel                |
| `Escape`                   | Return focus to the editor            |
| `Ctrl+/` / `Cmd+/`         | Toggle line comment (Monaco built-in) |

---

## Supported Languages

| Language   | Extension | Judge0 ID |
| ---------- | --------- | --------- |
| JavaScript | `.js`     | 63        |
| TypeScript | `.ts`     | 74        |
| Python     | `.py`     | 71        |
| Java       | `.java`   | 62        |
| C#         | `.cs`     | 51        |
| C++        | `.cpp`    | 54        |
| C          | `.c`      | 50        |
| Go         | `.go`     | 60        |
| Rust       | `.rs`     | 73        |

---

## API Reference

### `POST /api/execute`

Proxies a code execution request to Judge0 CE.

**Request body:**

```json
{
  "language_id": 54,
  "source_code": "#include <iostream>\nint main() { std::cout << \"Hi\"; }",
  "stdin": ""
}
```

**Constraints:**

- `language_id` must be one of the 9 supported IDs
- `source_code` must be a non-empty string, max 100 KB
- `stdin` must be a string, max 10 KB

**Success response (`200`):**

```json
{
  "stdout": "Hi",
  "stderr": null,
  "compile_output": null,
  "time": "0.003",
  "memory": 1024,
  "status": {
    "description": "Accepted"
  }
}
```

**Error responses:**

| Code  | Meaning                                                      |
| ----- | ------------------------------------------------------------ |
| `400` | Validation failed (bad language ID, oversized payload, etc.) |
| `429` | Rate limit exceeded (30 req/min per IP)                      |
| `502` | Judge0 upstream unavailable                                  |

---

## What's Next

The following areas are planned for future releases.

- UI & UX Polish
- Code Sharing & Collaboration
- Advanced Playground Features
- Performance & Optimization

---

## Contributing

Contributions are welcome! Feel free to open an [issue](../../issues) for bug reports or feature suggestions, or submit a [pull request](../../pulls) if you'd like to contribute directly.

## License

This project is licensed under the [MIT License](LICENSE).

---

_Clutch v1.0 — built with Monaco Editor and Judge0 CE_
