const input = document.getElementById('input')

export function saveSession() {
    const code = window.Editor.getCode();
    const language = document.getElementById("language").value;
    const inputValue = input.value;

    const session = {
        code,
        language,
        inputValue,
        timestamp: Date.now()
    }

    localStorage.setItem("clutch-session", JSON.stringify(session));
    console.log("Session saved")
}

export function loadSession() {
    const session = JSON.parse(localStorage.getItem("clutch-session")) || {
        code: "",
        language: "cpp",
        inputValue: "",
        timestamp: Date.now()
    }

    return session;
}

setInterval(saveSession, 5000);

window.addEventListener("beforeunload", ()=>{
    saveSession()
})