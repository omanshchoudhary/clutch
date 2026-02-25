import { loadSession, saveSession } from "../storage.js";
import { createFileObject, getLanguageFromExtension } from "./helpers.js";

const defaultCode = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World";
    return 0;
}`;

const defaultFile = createFileObject("main.cpp", "cpp", defaultCode);
const session = loadSession();

let files = Array.isArray(session?.files) && session.files.length > 0 ? session.files : [defaultFile];
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
  saveSession(files, activeFileId);
}

export function getActiveFile() {
  return files.find((file) => file.id === activeFileId);
}

export function createFile(name = "Untitiled.cpp") {
  let nextName = name;
  if (!nextName || !nextName.trim()) {
    nextName = "Untitiled.cpp";
  }

  if (files.some((file) => file.name === nextName)) {
    nextName = "Untitled-" + files.length + "." + nextName.split(".").pop();
  }

  const file = createFileObject(nextName);
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
