import {
  closeOthers,
  createFile,
  createFolder,
  deleteFile,
  duplicateFile,
  getFiles,
  renameFile,
  setActiveFileId,
  toggleFolderCollapsed
} from "./state.js";

export function bindTabInteractions(onRefresh, switchToFile) {
  const tabBar = document.getElementById("tab-bar");
  const menu = document.getElementById("context-menu");
  let contextFileId = null;
  let clickTimer = null;
  const clickDelayMs = 250;

  function findFileIdByTab(tab) {
    const tabName = tab.querySelector(".tab-name")?.textContent;
    const file = getFiles().find((item) => item.name === tabName);
    return file?.id || null;
  }

  function showContextMenu(x, y) {
    if (!menu) return;
    menu.style.left = x + "px";
    menu.style.top = y + "px";
    menu.classList.remove("hidden");
  }

  tabBar?.addEventListener("contextmenu", (event) => {
    const tab = event.target.closest(".tab");
    if (!tab) return;

    event.preventDefault();
    contextFileId = findFileIdByTab(tab);
    showContextMenu(event.pageX, event.pageY);
  });

  tabBar?.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (!tab || event.target.classList.contains("tab-close")) return;

    const fileId = findFileIdByTab(tab);
    if (!fileId) return;

    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
    }

    clickTimer = setTimeout(() => {
      switchToFile(fileId);
      clickTimer = null;
    }, clickDelayMs);
  });

  tabBar?.addEventListener("dblclick", (event) => {
    const tab = event.target.closest(".tab");
    if (!tab) return;

    const fileId = findFileIdByTab(tab);
    if (!fileId) return;

    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
    }

    const newName = prompt("Enter new file name:");
    if (!newName || !newName.trim()) return;
    renameFile(fileId, newName.trim());
    onRefresh();
  });

  menu?.addEventListener("click", (event) => {
    const actionItem = event.target.closest("[data-action]");
    if (!actionItem || !menu.contains(actionItem)) return;

    const action = actionItem.dataset.action;
    if (!action) return;

    if (action === "rename" && contextFileId) {
      const newName = prompt("Enter new file name:");
      if (newName && newName.trim()) {
        renameFile(contextFileId, newName.trim());
      }
    }

    if (action === "duplicate" && contextFileId) {
      duplicateFile(contextFileId);
    }

    if (action === "delete" && contextFileId) {
      deleteFile(contextFileId);
    }

    if (action === "delete-others" && contextFileId) {
      closeOthers(contextFileId);
      setActiveFileId(contextFileId);
    }

    menu.classList.add("hidden");
    onRefresh();
  });

  document.addEventListener("click", () => {
    menu?.classList.add("hidden");
  });
}

export function bindSidebarInteractions(onRefresh, switchToFile) {
  const fileTree = document.getElementById("sidebar-tree");

  document.getElementById("sidebar-new-file")?.addEventListener("click", () => {
    const name = prompt("Enter your file name:");
    const created = createFile(name, null);
    switchToFile(created.id);
  });

  document.getElementById("sidebar-new-folder")?.addEventListener("click", () => {
    const name = prompt("Enter your folder name:");
    createFolder(name, null);
    onRefresh();
  });

  fileTree?.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-folder-action]");
    if (actionButton) {
      const action = actionButton.dataset.folderAction;
      const folderId = actionButton.dataset.folderId;
      if (!action || !folderId) return;

      if (action === "add-file") {
        const name = prompt("Enter your file name:");
        const created = createFile(name, folderId);
        switchToFile(created.id);
        return;
      }

      if (action === "add-folder") {
        const name = prompt("Enter your folder name:");
        createFolder(name, folderId);
        onRefresh();
      }
      return;
    }

    const folderRow = event.target.closest(".tree-folder");
    if (folderRow) {
      const folderId = folderRow.dataset.folderId;
      if (!folderId) return;
      toggleFolderCollapsed(folderId);
      onRefresh();
      return;
    }

    const fileRow = event.target.closest(".tree-file");
    if (fileRow) {
      const fileId = fileRow.dataset.fileId;
      if (!fileId) return;
      switchToFile(fileId);
      return;
    }
  });

}

export function bindTopActions(onRefresh, onExport, switchToFile) {
  document.getElementById("new-file-btn")?.addEventListener("click", () => {
    const name = prompt("Enter your file name:");
    const created = createFile(name, null);
    switchToFile(created.id);
  });

  document.getElementById("export-button")?.addEventListener("click", () => {
    onExport();
  });
}
