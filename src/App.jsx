import { useState } from 'react'
import './App.css'
import CodeEditor from './components/CodeEditor'

function App() {
  const [language, setLanguage] = useState("54");
  const [code, setCode] = useState("Write your code here");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div className="h-screen bg-black text-white p-6 flex flex-col gap-4">
      {/* Header */}
      <header className="h-16 bg-neutral-900 rounded-xl px-6 flex items-center justify-between border border-neutral-800 shadow-md shrink-0 mt-2 mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Clutch</h1>
        <div className="flex items-center gap-3">
          <select
            className="bg-neutral-800 text-white px-4 py-2 rounded-lg border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 cursor-pointer transition-colors hover:bg-neutral-700"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="54">C++</option>
            <option value="62">Java</option>
            <option value="71">Python</option>
            <option value="50">C</option>
            <option value="63">JavaScript</option>
          </select>
          <button
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-5 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => console.log('Run code')}
          >
            ▶ Run
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-4 min-h-0">
        {/* Code Editor - explicit height */}
        <div className="flex-1 min-h-[300px] bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden shadow-md">
          <CodeEditor code={code} setCode={setCode} language={language} />
        </div>

        {/* Input/Output Section */}
        <div className="flex gap-4 h-40 shrink-0 mt-2 mb-2">
          <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium text-neutral-400 mb-2">Input</label>
            <textarea
              className="flex-1 w-full bg-neutral-900 text-white resize-none rounded-xl p-4 border border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 placeholder-neutral-500 transition-colors"
              placeholder="Enter your input here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium text-neutral-400 mb-2">Output</label>
            <div className="flex-1 w-full bg-neutral-900 text-white rounded-xl p-4 border border-neutral-800 overflow-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap">{output || <span className="text-neutral-500">Output will appear here...</span>}</pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

