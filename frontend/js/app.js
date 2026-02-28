//Imports
import { executeCode } from "./api.js";
import { clearSession } from "./storage.js";

//DOM Elements
const input = document.getElementById("input");
const output = document.getElementById("output");
const statusBadge = document.getElementById("status-badge");
const execMeta = document.getElementById("exec-meta");
const runButton = document.getElementById("run-button");
const appContainer = document.querySelector(".app");
const sidebarToggleBtn = document.getElementById("sidebar-toggle");

export function renderResult(result) {
  output.classList.remove(
    "output-stdout",
    "output-stderr",
    "output-compile-error",
  );
  output.classList.remove("output-empty");
  statusBadge.classList.remove("pending", "success", "error");

  if (result.outputType === "empty") {
    output.classList.add("output-empty");
    statusBadge.classList.add("success");
  } else if (result.outputType === "stderr") {
    output.classList.add("output-stderr");
    statusBadge.classList.add("error");
  } else if (
    result.outputType === "compile_error" ||
    result.outputType === "timeout"
  ) {
    output.classList.add("output-compile-error");
    statusBadge.classList.add("error");
  } else {
    output.classList.add("output-stdout");
    statusBadge.classList.add("success");
  }

  const text = result.text?.trim();
  if (text) {
    output.textContent = text;
  } else {
    output.textContent = "No output";
    output.classList.add("output-empty");
  }
  statusBadge.textContent = result.status;
  execMeta.textContent = `Time: ${result.time ?? "-"}s | Memory: ${result.memory ?? "-"} KB`;
}

document.getElementById("run-button").addEventListener("click", async () => {
  const code = window.Editor.getCode();
  const language = document.getElementById("language").value;

  output.classList.remove("output-empty");
  output.textContent = "Running...";
  statusBadge.classList.remove("success", "error");
  statusBadge.classList.add("pending");
  statusBadge.textContent = "Running";
  execMeta.textContent = "Time: -s | Memory: - KB";
  runButton.disabled = true;
  runButton.innerHTML = '<span class="btn-spinner"></span>Running...';
  try {
    const result = await executeCode(language, code, input.value);
    renderResult(result);
  } catch (err) {
    if (
      err.message.includes("Failed to fetch") ||
      err.message.includes("NetworkError") ||
      err.message.includes("Network request failed")
    ) {
      output.textContent = "Cannot reach server. Check your connection.";
    } else {
      output.textContent = `Error: ${err.message}`;
    }
    output.classList.remove("output-empty");
    statusBadge.classList.remove("pending", "success");
    statusBadge.classList.add("error");
    statusBadge.textContent = "Error";
    execMeta.textContent = "Time: -s | Memory: - KB";
  } finally {
    runButton.disabled = false;
    runButton.textContent = "Run";
  }
});

document.getElementById("language").addEventListener("change", (e) => {
  window.Editor.setLanguage(e.target.value);
});

// Copy Output button
document.getElementById("copy-output").addEventListener("click", async () => {
  const text = output.textContent;
  if (text && text.toLowerCase() !== "no output") {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById("copy-output");
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy"), 1500);
  }
});

// Clear Output button
document.getElementById("clear-output").addEventListener("click", () => {
  output.textContent = "";
  output.classList.remove("output-empty");
  statusBadge.textContent = "Ready";
  statusBadge.classList.remove("success", "error", "pending");
  execMeta.textContent = "Time: -s | Memory: - KB";
});

// Clear Session button
document.getElementById("clear-session").addEventListener("click", () => {
  if (confirm("Clear all files and reset? This cannot be undone.")) {
    window.__skipSessionSave = true;
    clearSession();
    location.reload();
  }
});

sidebarToggleBtn?.addEventListener("click", () => {
  appContainer?.classList.toggle("sidebar-collapsed");
});
