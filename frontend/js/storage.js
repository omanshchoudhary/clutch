const input = document.getElementById('input')

export function saveSession(files, activeFileId) {
    try {
        localStorage.setItem("files", JSON.stringify(files));
        localStorage.setItem("activeFileId", JSON.stringify(activeFileId));
    } catch (error) {
        console.warn("Could not save session:", error);
    }

}

export function loadSession() {
    try {
        const session = {
            files: JSON.parse(localStorage.getItem("files")),
            activeFileId: JSON.parse(localStorage.getItem("activeFileId"))
        }
        return session;
    } catch (error) {
        console.warn("localStorage unavailable:", error);
        return null;
    }
}

