import { saveSession } from "./storage.js";
import { bindSideBarActions, bindSidebarInteractions, bindTabInteractions, bindTopActions } from "./files/events.js";
import { exportFiles as exportAllFiles } from "./files/exporter.js";
import { deleteFile, getActiveFile, getActiveFileId, getFiles, getFolders, persistSession, setActiveFileId } from "./files/state.js";
import { renderSidebar, renderTabs } from "./files/render.js";

function refreshViews() {
  renderTabs((id) => {
    deleteFile(id);
    refreshViews();
    persistSession();
  });
  renderSidebar();
}

export function switchToFile(id) {
  const currentFile = getActiveFile();
  if (currentFile && window.Editor) {
    currentFile.content = window.Editor.getCode();
  }

  setActiveFileId(id);
  const nextFile = getActiveFile();
  if (!nextFile) return;

  if (window.Editor) {
    window.Editor.setValue(nextFile.content);
    window.Editor.setLanguage(nextFile.language);
  }

  const languageSelect = document.getElementById("language");
  if (languageSelect) {
    languageSelect.value = nextFile.language;
  }

  persistSession();
  refreshViews();
}

export function exportFiles() {
  return exportAllFiles();
}

bindTopActions(
  () => {
    refreshViews();
    persistSession();
  },
  exportFiles,
  switchToFile,
);

bindTabInteractions(
  () => {
    refreshViews();
    persistSession();
  },
  switchToFile,
);

bindSidebarInteractions(switchToFile);
bindSideBarActions(switchToFile);
refreshViews();

setInterval(() => {
  if (window.__skipSessionSave) return;
  saveSession(getFiles(), getActiveFileId(), getFolders());
}, 10000);

window.addEventListener("beforeunload", () => {
  if (window.__skipSessionSave) return;
  saveSession(getFiles(), getActiveFileId(), getFolders());
});

export { getActiveFile };
