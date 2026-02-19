function getLanguageFromExtension(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    const map = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'java': 'java',
        'cs': 'csharp',
        'cpp': 'cpp',
        'c': 'c',
        'go': 'go',
        'rs': 'rust'
    };

    return map[ext] || "plaintext"
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function createFileObject(name, language = null, content = '') {
    return {
        id: generateId(),
        name: name,
        language: language || getLanguageFromExtension(name),
        content: content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isDirty: false
    };
}

let files = []
let activeFileId = null

function getActiveFile() {
    return files.find(f => f.id === activeFileId)
}

function createFile(name = "Untitiled.cpp") {
    if (files.some(f => f.name === name)) {
        name = 'Untitled-' + files.length + '.' + name.split('.').pop();
    }

    const file = createFileObject(name);
    files.push(file)

    switchToFile(file.id)
    renderTabs();
}

function deleteFile(id) {
    if (files.length <= 1) return;

    const index = files.findIndex(f => f.id === id);
    files = files.filter(f => f.id !== id);

    if (activeFileId === id) {
        const newIndex = Math.min(index, files.length - 1);
        switchToFile(files[newIndex].id);
    }

    renderTabs();
}

function switchToFile(id) {
    const currentFile = getActiveFile()

    if (currentFile && window.Editor) {
        currentFile.content = window.Editor.getCode();
    }

    activeFileId = id;
    const newFile = getActiveFile();

    if (window.Editor) {
        window.Editor.setValue(newFile.content);
        window.Editor.setLanguage(newFile.language)
    }


    document.getElementById("language").value = newFile.language;

    renderTabs();
}

function renameFile(id, newName) {
    files = files.map(file => {
        if (file.id === id) {
            return { ...file, name: newName, language: getLanguageFromExtension(newName) }
        }
        return file
    })

    renderTabs();
}