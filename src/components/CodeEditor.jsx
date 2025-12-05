import Editor from "@monaco-editor/react";

export default function CodeEditor(props) {
  return (
    <Editor
      height="100%"
      language={props.language ? languageMap[props.language] || "cpp" : "cpp"}
      theme="vs-dark"
      value={props.code}
      onChange={value => props.setCode(value)}
    />
  )
}


const languageMap = {
  54: "cpp",
  62: "java",
  71: "python",
  50: "c",
  63: "javascript",
}

