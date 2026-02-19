//Imports
import { executeCode } from "./api.js";

//DOM Elements
const input = document.getElementById("input");
const output = document.getElementById("output");
const statusBadge = document.getElementById("status-badge");
const execMeta = document.getElementById("exec-meta");

export function renderResult(result) {
  output.classList.remove(
    "output-stdout",
    "output-stderr",
    "output-compile-error",
  );
  statusBadge.classList.remove(
    "pending",
    "success",
    "error",
  );

  if (result.outputType === "stderr") {
    output.classList.add("output-stderr");
    statusBadge.classList.add("error");
  } else if (result.outputType === "compile_error") {
    output.classList.add("output-compile-error");
    statusBadge.classList.add("error");
  } else {
    output.classList.add("output-stdout");
    statusBadge.classList.add("success");
  }

  output.textContent = result.text;
  statusBadge.textContent = result.status;
  execMeta.textContent = `Time: ${result.time ?? "-"}s | Memory: ${result.memory ?? "-"} KB`;
}

document.getElementById("run-button").addEventListener("click", async () => {
  const code = window.Editor.getCode();
  const language = document.getElementById("language").value;
  output.textContent = "Running...";
  statusBadge.classList.remove("success", "error");
  statusBadge.classList.add("pending");
  statusBadge.textContent = "Running";
  execMeta.textContent = "Time: -s | Memory: - KB";
  try {
    const result = await executeCode(language, code, input.value);
    renderResult(result);
  } catch (err) {
    output.textContent = `Error: ${err.message}`;
    statusBadge.classList.remove("pending", "success");
    statusBadge.classList.add("error");
    statusBadge.textContent = "Error";
    execMeta.textContent = "Time: -s | Memory: - KB";
  }
});

document.getElementById("language").addEventListener("change", (e) => {
  window.Editor.setLanguage(e.target.value);
});

// Copy Output button
document.getElementById("copy-output").addEventListener("click", async () => {
  const text = output.textContent;
  if (text && text !== "No output") {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById("copy-output");
    btn.textContent = "Copied!";
    setTimeout(() => btn.textContent = "Copy", 1500);
  }
});

// Clear Output button
document.getElementById("clear-output").addEventListener("click", () => {
  output.textContent = "";
  statusBadge.textContent = "Ready";
  statusBadge.classList.remove("success", "error", "pending");
  execMeta.textContent = "Time: -s | Memory: - KB";
});
