export function getLanguageFromExtension(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  const map = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    java: "java",
    cs: "csharp",
    cpp: "cpp",
    c: "c",
    go: "go",
    rs: "rust",
  };

  return map[ext] || "plaintext";
}

const DEFAULT_FILE_ICON = Object.freeze({
  src: "assets/file-icons/file.svg",
  cls: "file-icon-default",
  alt: "File icon",
});

const FILE_ICON_MAP = Object.freeze({
  js: { src: "assets/file-icons/js.svg", cls: "file-icon-js", alt: "JavaScript file icon" },
  jsx: { src: "assets/file-icons/js.svg", cls: "file-icon-js", alt: "JavaScript file icon" },
  mjs: { src: "assets/file-icons/js.svg", cls: "file-icon-js", alt: "JavaScript file icon" },
  ts: { src: "assets/file-icons/ts.svg", cls: "file-icon-ts", alt: "TypeScript file icon" },
  tsx: { src: "assets/file-icons/ts.svg", cls: "file-icon-ts", alt: "TypeScript file icon" },
  py: { src: "assets/file-icons/python.svg", cls: "file-icon-py", alt: "Python file icon" },
  java: { src: "assets/file-icons/java.svg", cls: "file-icon-java", alt: "Java file icon" },
  cs: { src: "assets/file-icons/csharp.svg", cls: "file-icon-cs", alt: "C sharp file icon" },
  cpp: { src: "assets/file-icons/cpp.svg", cls: "file-icon-cpp", alt: "C plus plus file icon" },
  cc: { src: "assets/file-icons/cpp.svg", cls: "file-icon-cpp", alt: "C plus plus file icon" },
  cxx: { src: "assets/file-icons/cpp.svg", cls: "file-icon-cpp", alt: "C plus plus file icon" },
  hpp: { src: "assets/file-icons/cpp.svg", cls: "file-icon-cpp", alt: "C plus plus file icon" },
  c: { src: "assets/file-icons/c.svg", cls: "file-icon-c", alt: "C file icon" },
  h: { src: "assets/file-icons/c.svg", cls: "file-icon-c", alt: "C file icon" },
  go: { src: "assets/file-icons/go.svg", cls: "file-icon-go", alt: "Go file icon" },
  rs: { src: "assets/file-icons/rust.svg", cls: "file-icon-rs", alt: "Rust file icon" },
});

export function getFileIcon(filename) {
  const ext = filename.trim().split(".").pop().toLowerCase();
  return FILE_ICON_MAP[ext] || DEFAULT_FILE_ICON;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function createFileObject(name, language = null, content = "", folderId=null) {
  return {
    id: generateId(),
    name,
    language: language || getLanguageFromExtension(name),
    content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDirty: false,
    folderId
  };
}

export function createFolderObject(name, parentId=null){
  return {
    id: generateId(),
    name,
    parentId
  }
}
