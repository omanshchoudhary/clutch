// Saving Files In Local Storage With Active File Id
export function saveSession(files, activeFileId, folders) {
  try {
    localStorage.setItem("files", JSON.stringify(files));
    localStorage.setItem("activeFileId", JSON.stringify(activeFileId));
    localStorage.setItem("folders", JSON.stringify(folders));
  } catch (error) {
    console.warn("Could not save session:", error);
  }
}

// Loading Files From Local Storage With Active File Id
export function loadSession() {
  try {
    const session = {
      files: JSON.parse(localStorage.getItem("files")),
      activeFileId: JSON.parse(localStorage.getItem("activeFileId")),
      folders: JSON.parse(localStorage.getItem("folders")),
    };
    return session;
  } catch (error) {
    console.warn("localStorage unavailable:", error);
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("files");
  localStorage.removeItem("activeFileId");
  localStorage.removeItem("folders");
}
