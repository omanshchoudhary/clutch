const input = document.getElementById('input')

export function saveSession(files, activeFileId) {
    localStorage.setItem("files", JSON.stringify(files));
    localStorage.setItem("activeFileId", JSON.stringify(activeFileId))
}

export function loadSession() {

    const session = {
        files: JSON.parse(localStorage.getItem("files")),
        activeFileId: JSON.parse(localStorage.getItem("activeFileId"))
    }

    return session;
}

