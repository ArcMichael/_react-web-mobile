// sprint9 当接口返回423时，展示全局的toast
export default function globalToast({ message }) {
  window.ifShow = true;
  if (window.ifShow) {
    if (
      document.getElementsByClassName("homePopUp") &&
      document.getElementsByClassName("homePopUp").length > 0
    )
      return;
    const html = document.createElement("div");
    html.className = "homePopUp";
    html.innerHTML = `<div class="centerText" style=>${message}</div>`;
    document.getElementById("root").appendChild(html);
    setTimeout(() => {
      document.getElementById("root").removeChild(html);
      window.ifShow = false;
    }, 3000);
  }
}
