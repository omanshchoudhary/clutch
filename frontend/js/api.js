function getLanguageId(language) {
    switch (language.toLowerCase()) {
        case "python":
            return 71;
        case "javascript":
            return 63;
        case "cpp":
        case "c++":
            return 54;
        case "java":
            return 62;
        case "c":
            return 50;
        default:
            return null;
    }
}

async function executeCode(language, code, input) {
    const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false", {
        method: "POST",
        headers: {
            "x-rapidapi-key": "",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "language_id": getLanguageId(language),
            "source_id": code,
            "stdin": input
        })
    })

    const data = await response.json()
    const token = data.token;



    const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`, {
        method: "GET",
        headers: {
            "x-rapidapi-key": "",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com"
        }
    });
    const result = await resultResponse.json()
    const output = result.stdout
}   