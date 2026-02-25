import { loadSession, saveSession } from "./storage.js";

function getLanguageFromExtension(filename) {
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

function getFileIcon(filename) {
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

function createFileObject(name, language = null, content = "") {
  return {
    id: generateId(),
    name: name,
    language: language || getLanguageFromExtension(name),
    content: content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDirty: false,
  };
}

// Default Code On Starting
const defaultCode = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World";
    return 0;
}`;

const defaultFile = createFileObject("main.cpp", "cpp", defaultCode);

// Setup Files And Editor On Startup
const session = loadSession();
let files = session?.files || [defaultFile];
let activeFileId = session?.activeFileId || defaultFile.id;

// File Operations
export function getActiveFile() {
  return files.find((f) => f.id === activeFileId);
}

function createFile(name = "Untitiled.cpp") {
  if (files.some((f) => f.name === name)) {
    name = "Untitled-" + files.length + "." + name.split(".").pop();
  }

  const file = createFileObject(name);
  files.push(file);

  switchToFile(file.id);
  saveSession(files, activeFileId);
  renderTabs();
}

function deleteFile(id) {
  if (files.length <= 1) return;

  const index = files.findIndex((f) => f.id === id);
  files = files.filter((f) => f.id !== id);

  if (activeFileId === id) {
    const newIndex = Math.min(index, files.length - 1);
    switchToFile(files[newIndex].id);
  }
  saveSession(files, activeFileId);
  renderTabs();
}

export function switchToFile(id) {
  const currentFile = getActiveFile();

  if (currentFile && window.Editor) {
    currentFile.content = window.Editor.getCode();
  }

  activeFileId = id;
  const newFile = getActiveFile();

  if (window.Editor) {
    window.Editor.setValue(newFile.content);
    window.Editor.setLanguage(newFile.language);
  }

  document.getElementById("language").value = newFile.language;
  saveSession(files, activeFileId);
  renderTabs();
}

function renameFile(id, newName) {
  files = files.map((file) => {
    if (file.id === id) {
      return {
        ...file,
        name: newName,
        language: getLanguageFromExtension(newName),
      };
    }
    return file;
  });
  saveSession(files, activeFileId);
  renderTabs();
}

// Render Tabs For Files
function renderTabs() {
  const tabBar = document.getElementById("tab-bar");
  if (!tabBar) return;

  const addBtn = tabBar.querySelector(".new-file-btn");
  tabBar.innerHTML = "";

  // Create a tab for each file
  files.forEach((file) => {
    const tab = document.createElement("div");
    tab.className = `tab  ${file.id === activeFileId ? "active" : ""}`;
    const icon = getFileIcon(file.name);

    // Tab content: unsaved dot + filename + close button
    tab.innerHTML = `
            ${file.isDirty ? '<span class="tab-unsaved"></span>' : ""}
            <span class="file-icon ${icon.cls}">${icon.glyph}</span>
            <span class="tab-name">${file.name}</span>
            <span class="tab-close">&times;</span>
        `;

    // Click on tab (not close button) to switch
    tab.addEventListener("click", (e) => {
      if (!e.target.classList.contains("tab-close")) {
        switchToFile(file.id);
      }
    });

    // Click close button to delete
    tab.querySelector(".tab-close").addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent switching to this tab
      deleteFile(file.id);
    });

    tabBar.appendChild(tab);
  });

  if (addBtn) {
    tabBar.appendChild(addBtn);
  }
}

// Add event listener to the add file button
document.getElementById("new-file-btn")?.addEventListener("click", () => {
  let name = prompt("Enter your name:");
  createFile(name);
});

document.getElementById("export-button")?.addEventListener("click", () => {
  exportFiles();
});

renderTabs();

// Save Session Every 5 Seconds
setInterval(() => {
  if (window.__skipSessionSave) return;
  saveSession(files, activeFileId);
}, 10000);

window.addEventListener("beforeunload", () => {
  if (window.__skipSessionSave) return;
  saveSession(files, activeFileId);
});

function setExportFeedback(message, isError = false) {
  const output = document.getElementById("output");
  const statusBadge = document.getElementById("status-badge");

  if (output) {
    output.textContent = message;
  }

  if (statusBadge) {
    statusBadge.classList.remove("pending", "success", "error");
    statusBadge.classList.add(isError ? "error" : "success");
    statusBadge.textContent = isError ? "Export Error" : "Exported";
  }
}

// Exporting Files
export async function exportFiles() {
  const JSZipConstructor = window.JSZip;
  if (typeof JSZipConstructor !== "function") {
    setExportFeedback("Export unavailable: ZIP library failed to load.", true);
    return;
  }

  const activeFile = getActiveFile();
  if (activeFile && window.Editor) {
    activeFile.content = window.Editor.getCode();
  }

  try {
    const zip = new JSZipConstructor();

    files.forEach((file) => {
      zip.file(file.name, file.content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "project.zip";
    link.click();
    setExportFeedback("Export complete: downloaded project.zip");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error("Export failed:", error);
    setExportFeedback("Export failed. Please try again.", true);
  }
}

// Tabs Context Menu (event delegation on tab-bar)

const tabBar = document.getElementById("tab-bar");
const menu = document.getElementById("context-menu");
let contextFileId = null; 

function showContextMenu(x, y) {
  menu.style.left = x + "px";
  menu.style.top = y + "px";
  menu.classList.remove("hidden");
}

tabBar.addEventListener("contextmenu", (e) => {

  const tab = e.target.closest(".tab");
  if (!tab) return;

  e.preventDefault();

 
  const tabName = tab.querySelector(".tab-name")?.textContent;
  const file = files.find((f) => f.name === tabName);
  contextFileId = file ? file.id : null;

  showContextMenu(e.pageX, e.pageY);
});

menu.addEventListener("click", (e) => {
  const action = e.target.dataset.action;

  if (action === "rename" && contextFileId) {
    const newName = prompt("Enter new file name:");
    if (newName && newName.trim()) {
      renameFile(contextFileId, newName.trim());
    }
  }

  if (action === "duplicate" && contextFileId) {
    const original = files.find((f) => f.id === contextFileId);
    if (original) {
      const copy = createFileObject(
        "Copy of " + original.name,
        original.language,
        original.content,
      );
      files.push(copy);
      switchToFile(copy.id);
      saveSession(files, activeFileId);
      renderTabs();
    }
  }

  if (action === "close" && contextFileId) {
    deleteFile(contextFileId);
  }

  if (action === "close-others" && contextFileId) {
    const keep = contextFileId;
    [...files].forEach((f) => {
      if (f.id !== keep) deleteFile(f.id);
    });
  }

  menu.classList.add("hidden");
});

document.addEventListener("click", () => {
  menu.classList.add("hidden");
});
