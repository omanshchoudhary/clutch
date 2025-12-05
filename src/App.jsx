import './App.css'
import CodeEditor from './components/CodeEditor'

function App() {
  return (
    <>
      <div className="bg-black text-white h-[70px]">
        <h1 className="text-3xl font-semibold">Clutch</h1>
        <p className="text-sm text-gray-300 mt-1">Powered by Monaco + Tailwind</p>
      </div>
      <CodeEditor />
    </>

  )
}

export default App

