import { getActiveFile, getFiles } from "./state.js";

function setExportFeedback(message, isError = false) {
  const output = document.getElementById("output");
  const statusBadge = document.getElementById("status-badge");

  if (output) {
    output.textContent = message;
  }

  if (statusBadge) {
    statusBadge.classList.remove("pending", "success", "error");
    statusBadge.classList.add(isError ? "error" : "success");
    statusBadge.textContent = isError ? "Export Error" : "Exported";
  }
}

export async function exportFiles() {
  const JSZipConstructor = window.JSZip;
  if (typeof JSZipConstructor !== "function") {
    setExportFeedback("Export unavailable: ZIP library failed to load.", true);
    return;
  }

  const activeFile = getActiveFile();
  if (activeFile && window.Editor) {
    const currentContent = window.Editor.getCode();
    getFiles().forEach((file) => {
      if (file.id === activeFile.id) {
        file.content = currentContent;
      }
    });
  }

  try {
    const zip = new JSZipConstructor();
    getFiles().forEach((file) => {
      zip.file(file.name, file.content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "project.zip";
    link.click();
    setExportFeedback("Export complete: downloaded project.zip");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error("Export failed:", error);
    setExportFeedback("Export failed. Please try again.", true);
  }
}
