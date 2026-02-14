import { loadSession } from "./storage.js"
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
    setLanguage
};

require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs"
    }
})

let editor;

const session = loadSession();
input.value = session.inputValue;
languageDropdown.value = session.language;


require(["vs/editor/editor.main"], () => {
    editor = monaco.editor.create(document.getElementById("editor"), {
        value: `${session.code}`,
        language: `${session.language}`,
        theme: "vs-dark",
        automaticLayout: true,
        fontSize: 14
    })
})