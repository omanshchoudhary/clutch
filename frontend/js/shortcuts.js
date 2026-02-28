import { saveSession } from "./storage.js";
import { getFiles, getActiveFileId, getFolders } from "./files/state.js";

const input = document.getElementById("input");
const output = document.getElementById("output");
const runButton = document.getElementById("run-button");

function isMac() {
  return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}

function getModifierKey() {
  return isMac() ? "Cmd" : "Ctrl";
}

document.addEventListener("keydown", (event) => {
  const mod = event.ctrlKey || event.metaKey;

  if (mod && event.key === "Enter") {
    event.preventDefault();
    runButton.click();
  }

  if (mod && event.key === "s") {
    event.preventDefault();
    saveSession(getFiles(), getActiveFileId(), getFolders());
  }

  if (mod && event.key === "l") {
    event.preventDefault();
    output.textContent = "";
  }

  if (event.key === "Escape") {
    document.getElementById("editor")?.focus();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const mod = getModifierKey();

  runButton.title = `Run code (${mod} + Enter)`;
  input.title = `Input (${mod} + S to save)`;
});
