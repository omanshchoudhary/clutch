import { getActiveFile } from "./files.js";

function getCode() {
  return editor.getValue();
}

function setLanguage(lang) {
  monaco.editor.setModelLanguage(editor.getModel(), lang);
}

window.Editor = {
  getCode,
  setLanguage,
  getValue: () => editor?.getValue() || "",
  setValue: (val) => editor?.setValue(val),
  setMonacoLanguage: (lang) =>
    monaco.editor.setModelLanguage(editor.getModel(), lang),
};

let editor;
const loadingElement = document.getElementById("editor-loading");

function hideEditorLoading() {
  loadingElement?.classList.add("hidden");
}

function showEditorLoadError() {
  if (!loadingElement) return;
  const text = loadingElement.querySelector("p");
  loadingElement.classList.remove("hidden");
  loadingElement.classList.add("error");
  if (text)
    text.textContent = "Failed to load editor. Please refresh the page.";
}

const monacoLoader = window.require;

if (!monacoLoader) {
  showEditorLoadError();
} else {
  monacoLoader.config({
    paths: {
      vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs",
    },
  });

  monacoLoader.onError = () => {
    showEditorLoadError();
  };

  monacoLoader(["vs/editor/editor.main"], () => {
    const activeFile = getActiveFile();
    const savedTheme = localStorage.getItem("clutch-theme");
    const monacoTheme = savedTheme === "light" ? "vs" : "vs-dark";

    editor = monaco.editor.create(document.getElementById("editor"), {
      value: activeFile ? activeFile.content : "",
      language: activeFile ? activeFile.language : "cpp",
      theme: monacoTheme,
      automaticLayout: true,
      fontSize: 14,
      lineHeight: 22,
      padding: { top: 12, bottom: 12 },
      scrollBeyondLastLine: false,
      cursorSmoothCaretAnimation: "on",
    });

    hideEditorLoading();
  });
}
