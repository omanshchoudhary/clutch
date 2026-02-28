import { loadSession, saveSession } from "../storage.js";
import { createFileObject, getLanguageFromExtension, createFolderObject } from "./helpers.js";


// Initial Setup 
const defaultCode = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World";
    return 0;
}`;

const defaultFile = createFileObject("main.cpp", "cpp", defaultCode);
const session = loadSession();

let files = Array.isArray(session?.files) && session.files.length > 0 ? session.files : [defaultFile];
files = migrateFiles(files);
let activeFileId = session?.activeFileId || files[0].id;

if (!files.some((file) => file.id === activeFileId)) {
  activeFileId = files[0].id;
}

export function getFiles() {
  return files;
}

export function getActiveFileId() {
  return activeFileId;
}

export function persistSession() {
  saveSession(files, activeFileId, folders);
}

export function getActiveFile() {
  return files.find((file) => file.id === activeFileId);
}

export function createFile(name = "Untitiled.cpp", folderId = null) {
  let nextName = name;
  if (!nextName || !nextName.trim()) {
    nextName = "Untitiled.cpp";
  }

  if (files.some((file) => file.name === nextName)) {
    nextName = "Untitled-" + files.length + "." + nextName.split(".").pop();
  }

  const file = createFileObject(nextName, null, "", folderId);
  files.push(file);
  return file;
}

export function deleteFile(id) {
  if (files.length <= 1) return;

  const index = files.findIndex((file) => file.id === id);
  if (index === -1) return;

  files = files.filter((file) => file.id !== id);

  if (activeFileId === id) {
    const newIndex = Math.min(index, files.length - 1);
    activeFileId = files[newIndex].id;
  }
}

export function renameFile(id, newName) {
  files = files.map((file) => {
    if (file.id !== id) return file;
    return {
      ...file,
      name: newName,
      language: getLanguageFromExtension(newName),
    };
  });
}

export function setActiveFileId(id) {
  activeFileId = id;
}

export function duplicateFile(id) {
  const original = files.find((file) => file.id === id);
  if (!original) return null;

  const copy = createFileObject("Copy of " + original.name, original.language, original.content);
  files.push(copy);
  activeFileId = copy.id;
  return copy;
}

export function closeOthers(keepId) {
  files = files.filter((file) => file.id === keepId);
  activeFileId = keepId;
}


// Sanitizing Files Data
function migrateFiles(files){
  if(!Array.isArray(files)) return [];

  return files.map(file =>({
    ...file,
    folderId: file.folderId ?? null
  }))
}

// Folders

let folders = session?.folders || []
folders= migrateFolders(folders)


// Sanitizing Folders Data
function migrateFolders(folders){
  if(!Array.isArray(folders)) return [];

  return folders.map(folder =>({
    ...folder,
    parentId: folder.parentId ?? null
  }))
}


export function getFolders(){
  return folders
}

export function renameFolder(id, newName) {
  folders = folders.map((folder) => {
    if (folder.id !== id) return folder;
    return {
      ...folder,
      name: newName,
    };
  });
}

export function deleteFolder(id) {

  files=files.map(file => {
    if(file.folderId !== id) return file;
    return {
      ...file,
      folderId: null
    }
  })

  folders = folders.filter((folder) => folder.id !== id);
}

export function setFileFolder(fileId, folderId){
  files=files.map(file =>{
    if(file.id !== fileId) return file;
    return {
      ...file,
      folderId
    }
  })
}
export function createFolder(name = "New Folder", parentId = null) {
  let nextName = name;
  if (!nextName || !nextName.trim()) {
    nextName = "New Folder";
  }

  if (folders.some((folder) => folder.name === nextName && folder.parentId === parentId)) {
    nextName = `${nextName}-${folders.length}`;
  }

  const folder = createFolderObject(nextName, parentId);
  folders.push(folder);
  return folder;
}


// Collapsed Folders

export const collapsedFolderIds = new Set();

export function toggleFolderCollapsed(folderId) {
  if (collapsedFolderIds.has(folderId)) {
    collapsedFolderIds.delete(folderId);
  } else {
    collapsedFolderIds.add(folderId);
  }
}

export function isFolderCollapsed(folderId){
  return collapsedFolderIds.has(folderId);
}
