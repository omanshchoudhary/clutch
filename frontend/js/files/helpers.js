export function getLanguageFromExtension(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  const map = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    java: "java",
    cs: "csharp",
    cpp: "cpp",
    c: "c",
    go: "go",
    rs: "rust",
  };

  return map[ext] || "plaintext";
}

export function getFileIcon(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  const iconMap = {
    js: { glyph: "JS", cls: "file-icon-js" },
    ts: { glyph: "TS", cls: "file-icon-ts" },
    py: { glyph: "PY", cls: "file-icon-py" },
    java: { glyph: "J", cls: "file-icon-java" },
    cs: { glyph: "C#", cls: "file-icon-cs" },
    cpp: { glyph: "C++", cls: "file-icon-cpp" },
    c: { glyph: "C", cls: "file-icon-c" },
    go: { glyph: "GO", cls: "file-icon-go" },
    rs: { glyph: "RS", cls: "file-icon-rs" },
  };

  return iconMap[ext] || { glyph: "TXT", cls: "file-icon-default" };
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function createFileObject(name, language = null, content = "") {
  return {
    id: generateId(),
    name,
    language: language || getLanguageFromExtension(name),
    content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDirty: false,
  };
}
