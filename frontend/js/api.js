function getLanguageId(language) {
    switch (language.toLowerCase()) {
        case "python":
            return 71;
        case "javascript":
            return 63;
        case "typescript":
            return 74;
        case "cpp":
        case "c++":
            return 54;
        case "java":
            return 62;
        case "csharp":
        case "c#":
            return 51;
        case "c":
            return 50;
        case "go":
            return 60;
        case "rust":
            return 73;
        default:
            return null;
    }
}

async function executeCode(language, code, input) {
    const languageId = getLanguageId(language);
    if (!languageId) throw new Error(`Unsupported language: ${language}`);

    const response = await fetch("http://localhost:3000/api/execute",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            language_id: languageId,
            source_code: code,
            stdin: input
        })
    })

    if (!response.ok) throw new Error("Execution failed");

    const result = await response.json();

    if (result.stderr) return `Error:\n${result.stderr}`;
    if (result.compile_output) return `Compile Error:\n${result.compile_output}`;
    return result.stdout;

}   