import { useState } from "react"
import Editor from "@monaco-editor/react";

export default function CodeEditor() {
    const [code, setCode] = useState("Write your code here")
    return (
        <main className="h-[calc(100vh-70px)]">
            <Editor
                height="100%"
                language="cpp"
                theme="vs-dark"
                value={code}
                onChange={value => setCode(value)}
            />
        </main>
    )
}

