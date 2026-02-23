import { getActiveFile } from "./files.js"


const runButton = document.getElementById('run')

const input = document.getElementById('input')
const languageDropdown = document.getElementById('language')

function getCode() {
    return editor.getValue();
}

function setLanguage(lang) {
    monaco.editor.setModelLanguage(editor.getModel(), lang)
}

window.Editor = {
    getCode,
    setLanguage,
    getValue: () => editor?.getValue() || '',
    setValue: (val) => editor?.setValue(val),
    setMonacoLanguage: (lang) => monaco.editor.setModelLanguage(editor.getModel(), lang)
};

require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs"
    }
})

let editor;
const loadingElement = document.getElementById('editor-loading');

function hideEditorLoading() {
    loadingElement?.classList.add('hidden');
}

function showEditorLoadError() {
    if (!loadingElement) return;
    const text = loadingElement.querySelector('p');
    loadingElement.classList.remove('hidden');
    loadingElement.classList.add('error');
    if (text) text.textContent = 'Failed to load editor. Please refresh the page.';
}

require.onError = () => {
    showEditorLoadError();
}

require(["vs/editor/editor.main"], () => {
    const activeFile = getActiveFile();
    const savedTheme = localStorage.getItem('clutch-theme');
    const monacoTheme = savedTheme === 'light' ? 'vs' : 'vs-dark';
    
    editor = monaco.editor.create(document.getElementById("editor"), {
        value: activeFile ? activeFile.content : '',
        language: activeFile ? activeFile.language : 'cpp',
        theme: monacoTheme,
        automaticLayout: true,
        fontSize: 14
    });

    hideEditorLoading();
})
