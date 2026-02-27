import {
  closeOthers,
  createFile,
  createFolder,
  deleteFile,
  duplicateFile,
  getFiles,
  renameFile,
  setActiveFileId,
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

    if (action === "close" && contextFileId) {
      deleteFile(contextFileId);
    }

    if (action === "close-others" && contextFileId) {
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

export function bindSidebarInteractions(switchToFile) {
  const fileTree = document.getElementById("sidebar-tree");
  fileTree?.addEventListener("click", (event) => {
    const row = event.target.closest(".tree-file");
    if (!row) return;
    const fileId = row.dataset.fileId;
    if (!fileId) return;
    switchToFile(fileId);
  });
}

export function bindTopActions(onRefresh, onExport, switchToFile) {
  document.getElementById("new-file-btn")?.addEventListener("click", () => {
    const name = prompt("Enter your name:");
    const created = createFile(name);
    switchToFile(created.id);
  });

  document.getElementById("export-button")?.addEventListener("click", () => {
    onExport();
  });
}

export function bindSideBarActions(switchToFile){
  document.getElementById("sidebar-new-file")?.addEventListener("click",()=>{
    const name = prompt("Enter your name:");
    const created = createFile(name);
    switchToFile(created.id);
  })

  document.getElementById("sidebar-new-folder")?.addEventListener("click",()=>{
    const name = prompt("Enter your folder name:");
    const created = createFolder(name);
  })
}
