import { loadSession, saveSession } from "./storage.js";

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



// Default Code On Starting
const defaultCode = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World";
    return 0;
}`;

const defaultFile = createFileObject('main.cpp', 'cpp', defaultCode);


// Setup Files And Editor On Startup
let files = loadSession().files || [defaultFile];
let activeFileId = loadSession().activeFileId || defaultFile.id;




// File Operations
export function getActiveFile() {
    return files.find(f => f.id === activeFileId)
}

function createFile(name = "Untitiled.cpp") {
    if (files.some(f => f.name === name)) {
        name = 'Untitled-' + files.length + '.' + name.split('.').pop();
    }

    const file = createFileObject(name);
    files.push(file)

    switchToFile(file.id)
    saveSession(files, activeFileId)
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
    saveSession(files, activeFileId);
    renderTabs();
}

export function switchToFile(id) {
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
    saveSession(files, activeFileId);
    renderTabs();
}

function renameFile(id, newName) {
    files = files.map(file => {
        if (file.id === id) {
            return { ...file, name: newName, language: getLanguageFromExtension(newName) }
        }
        return file
    })
    saveSession(files, activeFileId);
    renderTabs();
}




// Render Tabs For Files
function renderTabs() {
    const tabBar = document.getElementById('tab-bar');
    if (!tabBar) return;

    const addBtn = tabBar.querySelector('.new-file-btn');
    tabBar.innerHTML = '';

    // Create a tab for each file
    files.forEach(file => {
        const tab = document.createElement('div');
        tab.className = `tab ${file.id === activeFileId ? 'active' : ''}`;

        // Tab content: unsaved dot + filename + close button
        tab.innerHTML = `
            ${file.isDirty ? '<span class="tab-unsaved"></span>' : ''}
            <span class="tab-name">${file.name}</span>
            <span class="tab-close">&times;</span>
        `;

        // Click on tab (not close button) to switch
        tab.addEventListener('click', (e) => {
            if (!e.target.classList.contains('tab-close')) {
                switchToFile(file.id);
            }
        });

        // Click close button to delete
        tab.querySelector('.tab-close').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent switching to this tab
            deleteFile(file.id);
        });

        tabBar.appendChild(tab);
    });

    if (addBtn) {
        tabBar.appendChild(addBtn);
    }
}


// Add event listener to the add file button
document.getElementById('new-file-btn')?.addEventListener('click', () => {
    createFile();
});


renderTabs();

setInterval(() => saveSession(files, activeFileId), 5000);

window.addEventListener("beforeunload", () => {
    saveSession(files, activeFileId)
})