const input = document.getElementById("input");
const output = document.getElementById("output")
const runButton = document.getElementById("run-button")

function isMac(){ 
    return navigator.platform.toUpperCase().indexOf("MAC") >=0;
}

function getModifierKey(){
    return isMac() ? "Cmd" : "Ctrl";
}

async function runCode() {
    const code = window.Editor.getCode();
    const language=document.getElementById("language").value;
    output.textContent="Running..."

    if(!code.trim()){
        output.textContent="Warning: No code to execute"
        return;
    }
    runButton.disabled=true;
    runButton.textContent="Running..."
    output.textContent="Running..."

    try{
        const result = await executeCode(language, code,input.value)
        output.textContent=result || "No Output";
    } catch(err){
        output.textContent=`Error: ${err.message}`
    } finally {
        runButton.disabled=false;
        runButton.textContent="Run"
    }
}

function clearOutput(){
    output.textContent="";
    input.focus()
}

function focusEditor(){
    window.Editor.focus();
}

function saveState(){
    const code = window.Editor.getCode();
    const language=document.getElementById("language").value;
    const inputValue=input.value;

    const session = {
        code,
        language,
        inputValue,
        timestamp: Date.now()
    }

    localStorage.setItem("clutch-session", JSON.stringify(session));
    console.log("Session saved")
}

document.addEventListener("keydown", async (event) => {
    const mod = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;

    if(mod && event.key==="Enter"){
        event.preventDefault();
        await runCode()
    }

    if(mod && event.key==="s"){
        event.preventDefault();
        saveState();
    }

    if(mod && event.key==="l"){
        event.preventDefault();
        clearOutput();
    }

    if(event.key==="Escape"){
        focusEditor();
    }

})

document.addEventListener("DOMContentLoaded", ()=>{
    const mod = getModifierKey();

    runButton.title=`Run code (${mod} + Enter)`
    input.title=`Input (${mod} + S to save)`
})
