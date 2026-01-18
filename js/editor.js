function getCode(){
    return editor.getValue();
}

function setLanguage(setModelLanguage){
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
require(["vs/editor/editor.main"], () => {
    editor = monaco.editor.create(document.getElementById("editor"), {
        value: `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`,
        language: "cpp",
        theme: "vs-dark",
        automaticLayout: true,
        fontSize: 14
    })
})