document.getElementById("run-button").addEventListener("click", () => {
  const code = window.Editor.getCode();
  console.log(code);
});


document.getElementById("language").addEventListener("change", (e) => {
  window.Editor.setLanguage(e.target.value);
});
