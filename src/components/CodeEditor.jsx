import { useState } from "react"
import Editor from "@monaco-editor/react";

export default function CodeEditor(){
    [code, setCode]=useState("Write your code here")
    return (
        <div className="h-[500px]">
            <Editor />  
        </div>
    )
}