const input = document.getElementById("input");
const output = document.getElementById("output")

document.getElementById("run-button").addEventListener("click", async () => {
  const code = window.Editor.getCode();
  const language=document.getElementById("language").value;
  output.textContent="Running..."

  try{
    const result = await executeCode(language, code,input.value)
    output.textContent=result || "No Output"
  } catch(err){
    output.textContent=`Error: ${err.message}`
  }
});


document.getElementById("language").addEventListener("change", (e) => {
  window.Editor.setLanguage(e.target.value);
});
