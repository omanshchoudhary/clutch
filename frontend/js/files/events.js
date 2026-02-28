import {
  createFile,
  createFolder,
  deleteFile,
  getFiles,
  renameFolder,
  renameFile,
  toggleFolderCollapsed,
  deleteFolder
} from "./state.js";

let contextSource = null;

function showContextMenu(menu, x, y) {
  if (!menu) return;
  menu.style.left = x + "px";
  menu.style.top = y + "px";
  menu.classList.remove("hidden");
}

function hideContextMenu(menu) {
  if (!menu) return;
  menu.classList.add("hidden");
}

// Tab Events
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


  tabBar?.addEventListener("contextmenu", (event) => {
    const tab = event.target.closest(".tab");
    if (!tab) return;

    event.preventDefault();
    contextSource = "tab";
    contextFileId = findFileIdByTab(tab);
    showContextMenu(menu, event.pageX, event.pageY);
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
    if (contextSource !== "tab") return;

    const action = actionItem.dataset.action;
    if (!action) return;

    if (action === "rename" && contextFileId) {
      const newName = prompt("Enter new file name:");
      if (newName && newName.trim()) {
        renameFile(contextFileId, newName.trim());
      }
    }

    if (action === "delete" && contextFileId) {
      deleteFile(contextFileId);
    }

    hideContextMenu(menu);
    contextFileId = null;
    contextSource = null;
    onRefresh();
  });

  document.addEventListener("click", () => {
    hideContextMenu(menu);
    contextSource = null;
  });
}

// SideBar Events

export function bindSidebarInteractions(onRefresh, switchToFile) {
  const fileTree = document.getElementById("sidebar-tree");
  const menu = document.getElementById("context-menu");
  let contextTarget = null;

  document.getElementById("sidebar-new-file")?.addEventListener("click", () => {
    const name = prompt("Enter your file name:");
    const created = createFile(name, null);
    switchToFile(created.id);
  });

  document
    .getElementById("sidebar-new-folder")
    ?.addEventListener("click", () => {
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

  fileTree?.addEventListener("contextmenu", (event) => {
    const fileRow = event.target.closest(".tree-file");
    const folderRow = event.target.closest(".tree-folder");

    if (!fileRow && !folderRow) return;
    event.preventDefault();
    contextSource = "sidebar";

    if (fileRow) {
      const fileId = fileRow.dataset.fileId;
      if (!fileId) return;
      contextTarget = { type: "file", id: fileId };
    } else {
      const folderId = folderRow.dataset.folderId;
      if (!folderId) return;
      contextTarget = { type: "folder", id: folderId };
    }
    showContextMenu(menu, event.pageX, event.pageY);
  });


  menu?.addEventListener("click", (event) => {
    const actionItem = event.target.closest("[data-action]");
    if (!actionItem || !menu.contains(actionItem) || !contextTarget) return;
    if (contextSource !== "sidebar") return;

    const action = actionItem.dataset.action;
    if (!action) return;

    if (action === "rename") {
      const newName = prompt(
        contextTarget.type === "folder" ? "Enter new folder name:" : "Enter new file name:"
      );
      if (newName && newName.trim()) {
        if (contextTarget.type === "folder") {
          renameFolder(contextTarget.id, newName.trim());
        } else {
          renameFile(contextTarget.id, newName.trim());
        }
      }
    }

    if (action === "delete") {
      if (contextTarget.type === "folder") {
        deleteFolder(contextTarget.id);
      } else {
        deleteFile(contextTarget.id);
      }
    }

    hideContextMenu(menu);
    contextTarget = null;
    contextSource = null;
    onRefresh();
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
