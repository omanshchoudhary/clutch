import { loadSession } from "./storage.js"
import { switchToFile, getActiveFile } from "./files.js"

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


require(["vs/editor/editor.main"], () => {
    const activeFile = getActiveFile();
    
    editor = monaco.editor.create(document.getElementById("editor"), {
        value: activeFile ? activeFile.content : '',
        language: activeFile ? activeFile.language : 'cpp',
        theme: "vs-dark",
        automaticLayout: true,
        fontSize: 14
    })
})