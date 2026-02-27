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
║                       Online IDE                           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

A lightweight web-based IDE with multi-language support and real-time code execution.

## Overview

Clutch is an online integrated development environment that enables users to write, edit, and execute code directly in the browser. Built with Monaco Editor and powered by Judge0 API for code execution.

## Features

- **Multi-language Support**: Write code in JavaScript, TypeScript, Python, Java, C#, C++, C, Go, and Rust
- **Monaco Editor Integration**: Professional code editing experience with syntax highlighting and IntelliSense
- **Real-time Execution**: Run code and see output instantly
- **Input/Output Panels**: Dedicated areas for standard input and output
- **Modern UI**: Clean, VS Code-inspired dark theme interface
- **Responsive Design**: Optimized layout for different screen sizes

## Installation

**Requirements:**

- Node.js v14+
- npm
- Judge0 RapidAPI key

**Setup:**

```bash
# Clone the repository
git clone <repository-url>
cd clutch

# Install backend dependencies
cd backend
npm install

# Create environment file
cp .env.example .env
# Add your Judge0 API key to .env
```

## Configuration

Create a `.env` file in the `backend` directory:

```env
JUDGE0_KEY=your_rapidapi_key_here
PORT=3000
```

Get your Judge0 API key from [RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce).

## Quick Start

**Start the backend server:**

```bash
cd backend
npm run dev
```

**Open the frontend:**

```bash
# Open frontend/index.html in your browser
# Or use a local server like Live Server
```

The IDE will be available at `http://localhost:5500` (or your local server port).

## Usage

### Writing Code

1. Select your language from the dropdown menu
2. Write your code in the Monaco editor
3. Enter any required input in the Input panel
4. Click the "Run" button to execute

### Supported Languages

| Language   | Version      |
| ---------- | ------------ |
| JavaScript | Node.js 16.x |
| TypeScript | 4.x          |
| Python     | 3.x          |
| Java       | JDK 11       |
| C#         | Mono 6.x     |
| C++        | GCC 9.x      |
| C          | GCC 9.x      |
| Go         | 1.x          |
| Rust       | 1.x          |

### Example: Running C++ Code

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}
```

Click "Run" and see the output in the Output panel.

### Example: Python with Input

**Code:**

```python
name = input()
print(f"Hello, {name}!")
```

**Input:**

```
World
```

**Output:**

```
Hello, World!
```

## Project Structure

```
clutch/
├── backend/
│   ├── server.js           # Express server
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── index.html         # Main HTML file
│   ├── css/
│   │   └── styles.css     # UI styling
│   └── js/
│       ├── editor.js      # Monaco editor setup
│       ├── api.js         # API communication
│       └── app.js         # Main application logic
├── .gitignore
└── README.md
```

## API Reference

### Execute Code Endpoint

**POST** `/api/execute`

**Request Body:**

```json
{
  "language_id": 54,
  "source_code": "#include <iostream>\nint main() { return 0; }",
  "stdin": ""
}
```

**Response:**

```json
{
  "stdout": "output here",
  "stderr": null,
  "compile_output": null,
  "status": {
    "description": "Accepted"
  }
}
```

## Development

**Run backend in development mode:**

```bash
cd backend
npm run dev
```

The server will restart automatically on file changes using nodemon.

**Frontend development:**

- Use any local development server
- Recommended: VS Code Live Server extension
- Monaco Editor loads from CDN

## Error Handling

The application handles common errors:

```bash
# Compilation error
Compile Error:
error: expected ';' before 'return'

# Runtime error
Error:
Traceback (most recent call last):
  File "main.py", line 1
    print(undefined_variable)
NameError: name 'undefined_variable' is not defined

# Network error
Error: Execution failed
```

## Technologies Used

**Frontend:**

- Monaco Editor - Code editor
- Vanilla JavaScript - Application logic
- HTML5/CSS3 - UI structure and styling

**Backend:**

- Node.js - Runtime environment
- Express - Web framework
- Axios - HTTP client
- Judge0 API - Code execution engine

## Known Issues

- Large outputs may slow down the UI
- Some languages require specific input formatting
- Editor may take a moment to load on first visit

## Contributing

This project is currently in development. Contributions, issues, and feature requests are welcome.

---

**Note:** This project is a work in progress. Features and documentation are subject to change.
