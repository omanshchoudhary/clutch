import { getFileIcon } from "./helpers.js";
import { getActiveFileId, getFiles, getFolders } from "./state.js";

const DEFAULT_ICON_SRC = "assets/file-icons/file.svg";

function renderUiIcon(iconName, extraClass = "") {
  if (window.UIIcons && typeof window.UIIcons.render === "function") {
    return window.UIIcons.render(iconName, extraClass);
  }

  return `<span class="material-symbols-outlined ui-icon icon-fallback ${extraClass}" aria-hidden="true">help</span>`;
}

function renderFileIcon(icon, extraClass = "") {
  return `
    <span class="file-icon ${extraClass} ${icon.cls}" data-file-icon-class="${icon.cls}">
      <img
        class="file-icon-svg"
        src="${icon.src}"
        alt="${icon.alt}"
        draggable="false"
        onerror="this.onerror=null;this.src='${DEFAULT_ICON_SRC}'"
      />
    </span>
  `;
}

export function renderTabs(onClose) {
  const tabBar = document.getElementById("tab-bar");
  if (!tabBar) return;

  const addBtn = tabBar.querySelector(".new-file-btn");
  tabBar.innerHTML = "";

  getFiles().forEach((file) => {
    const tab = document.createElement("div");
    tab.className = `tab tab-item ${file.id === getActiveFileId() ? "active" : ""}`;
    const icon = getFileIcon(file.name);

    tab.innerHTML = `
      ${file.isDirty ? '<span class="tab-unsaved"></span>' : ""}
      ${renderFileIcon(icon)}
      <span class="tab-name">${file.name}</span>
      <button class="tab-close" type="button" aria-label="Close file">
        ${renderUiIcon("tab-close")}
      </button>
    `;

    tab.querySelector(".tab-close")?.addEventListener("click", (event) => {
      event.stopPropagation();
      onClose(file.id);
    });

    tabBar.appendChild(tab);
  });

  if (addBtn) {
    tabBar.appendChild(addBtn);
  }
}


export function renderSidebar() {
  const fileTree = document.getElementById("sidebar-tree");
  if (!fileTree) return;

  fileTree.innerHTML = "";

  getFolders().forEach((folder) => {
    const folderNode = document.createElement('div');
    folderNode.className="tree-folder-node"
    folderNode.dataset.folderId = folder.id;

    folderNode.innerHTML = 
    `
      <button class="tree-item tree-folder" data-folder-id="${folder.id}" type="button">
        ${renderUiIcon("folder-expand", "tree-caret")}
        ${renderUiIcon("folder", "tree-folder-icon")}
        <span class="tree-item-name">${folder.name}</span>
      </button>
      <div class="tree-children"></div>
    `;

    const children = folderNode.querySelector(".tree-children")
    getFiles().forEach((file) => {
      if (file.folderId === folder.id) {
        const icon = getFileIcon(file.name);
        const isActive = file.id === getActiveFileId() ? " is-active" : "";
        children.innerHTML += 
        `
          <button class="tree-item tree-file${isActive}" data-file-id="${file.id}" type="button">
            ${renderFileIcon(icon, "tree-item-icon")}
            <span class="tree-item-name">${file.name}</span>
          </button>
        `;
      }
    });

    return fileTree.appendChild(folderNode);
  })

  getFiles().forEach((file) => {
    if(file.folderId !== null) return;
    const icon = getFileIcon(file.name);
    const isActive = file.id === getActiveFileId() ? " is-active" : "";
    const fileNode = document.createElement('div');
    fileNode.innerHTML += `
      <button class="tree-item tree-file${isActive}" data-file-id="${file.id}" type="button">
        ${renderFileIcon(icon, "tree-item-icon")}
        <span class="tree-item-name">${file.name}</span>
      </button>
    `;
    return fileTree.appendChild(fileNode);
  });

}
