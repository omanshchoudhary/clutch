import { getFileIcon } from "./helpers.js";
import {
  getActiveFileId,
  getFiles,
  getFolders,
  isFolderCollapsed,
} from "./state.js";

const DEFAULT_ICON_SRC = "assets/file-icons/file.svg";
const ROOT_PARENT_ID = "__root__";

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

function createFileRowButton(file) {
  const icon = getFileIcon(file.name);
  const isActive = file.id === getActiveFileId() ? " is-active" : "";
  const button = document.createElement("button");
  button.className = `tree-item tree-file${isActive}`;
  button.dataset.fileId = file.id;
  button.type = "button";
  button.innerHTML = `
    ${renderFileIcon(icon, "tree-item-icon")}
    <span class="tree-item-name">${file.name}</span>
  `;
  return button;
}

function indexFoldersByParent(folders) {
  const map = new Map();
  folders.forEach((folder) => {
    const key = folder.parentId ?? ROOT_PARENT_ID;
    const bucket = map.get(key) || [];
    bucket.push(folder);
    map.set(key, bucket);
  });
  return map;
}

function indexFilesByFolder(files) {
  const map = new Map();
  files.forEach((file) => {
    const key = file.folderId ?? ROOT_PARENT_ID;
    const bucket = map.get(key) || [];
    bucket.push(file);
    map.set(key, bucket);
  });
  return map;
}

function createFolderNode(folder, foldersByParentId, filesByFolderId) {
  const isCollapsed = isFolderCollapsed(folder.id);
  const folderNode = document.createElement("div");
  folderNode.className = `tree-folder-node${isCollapsed ? " is-collapsed" : ""}`;
  folderNode.dataset.folderId = folder.id;

  folderNode.innerHTML = `
    <div class="tree-item tree-folder-row">
      <button class="tree-folder tree-folder-toggle" data-folder-id="${folder.id}" type="button" aria-expanded="${!isCollapsed}">
        ${renderUiIcon(isCollapsed ? "folder-collapse" : "folder-expand", "tree-caret")}
        ${renderUiIcon("folder", "tree-folder-icon")}
        <span class="tree-item-name">${folder.name}</span>
      </button>
      <div class="tree-folder-actions">
        <button
          class="tree-folder-action"
          type="button"
          data-folder-action="add-file"
          data-folder-id="${folder.id}"
          aria-label="Add file in ${folder.name}"
          title="Add file"
        >
          ${renderUiIcon("folder-add-file", "tree-folder-action-icon")}
        </button>
        <button
          class="tree-folder-action"
          type="button"
          data-folder-action="add-folder"
          data-folder-id="${folder.id}"
          aria-label="Add folder in ${folder.name}"
          title="Add folder"
        >
          ${renderUiIcon("folder-add-folder", "tree-folder-action-icon")}
        </button>
      </div>
    </div>
    <div class="tree-children"></div>
  `;

  const children = folderNode.querySelector(".tree-children");
  if (!children) return folderNode;

  const childFolders = foldersByParentId.get(folder.id) || [];
  childFolders.forEach((childFolder) => {
    children.appendChild(createFolderNode(childFolder, foldersByParentId, filesByFolderId));
  });

  const childFiles = filesByFolderId.get(folder.id) || [];
  childFiles.forEach((file) => {
    children.appendChild(createFileRowButton(file));
  });

  return folderNode;
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

  const folders = getFolders();
  const files = getFiles();
  const foldersByParentId = indexFoldersByParent(folders);
  const filesByFolderId = indexFilesByFolder(files);

  const rootFolders = foldersByParentId.get(ROOT_PARENT_ID) || [];
  rootFolders.forEach((rootFolder) => {
    fileTree.appendChild(createFolderNode(rootFolder, foldersByParentId, filesByFolderId));
  });

  const rootFiles = filesByFolderId.get(ROOT_PARENT_ID) || [];
  rootFiles.forEach((rootFile) => {
    fileTree.appendChild(createFileRowButton(rootFile));
  });
}
