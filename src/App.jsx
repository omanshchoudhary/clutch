import { useState } from 'react'
import './App.css'
import CodeEditor from './components/CodeEditor'

function App() {
  const [language, setLanguage] = useState("54");
  const [code, setCode] = useState("Write your code here");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <>
      <div className="bg-black text-white h-[65px] flex flex-row justify-between items-center ">
        <div className="text-3xl font-semibold mr-2">Clutch</div>
        <select className="bg-gray-800 text-white px-3 py-2 rounded" value={language}
          onChange={(e) => setLanguage(e.target.value)}>
          <option value="54">C++</option>
          <option value="62">Java</option>
          <option value="71">Python</option>
          <option value="50">C</option>
          <option value="63">JavaScript</option>
        </select>
      </div>
      <main className="h-[calc(100vh-70px)] flex flex-col gap-3 bg-black text-white px-4 pb-4">
        <div className="flex-1 min-h-0 border border-gray-800 rounded-lg overflow-hidden">
          <CodeEditor code={code} setCode={setCode} language={language} />
        </div>
        <textarea
          className="w-full bg-gray-900 text-white h-32 resize-none rounded-lg p-3 border border-gray-800"
          rows={4}
          placeholder="Input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
      </main>
    </>
  )
}

export default App

