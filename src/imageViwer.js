const IMAGE_PATH_PREFIX =
  "https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public";

export default function ImageViewer({ $app, initialState, onFileClick }) {
  this.state = initialState;
  this.onFileClick = onFileClick;
  this.$target = document.createElement("div");
  this.$target.className = "Modal ImageViewer";

  $app.appendChild(this.$target);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    this.$target.innerHTML = `<div class="content">${
      this.state ? `<img src="${IMAGE_PATH_PREFIX}${this.state}"` : ""
    }</div>`;

    this.$target.style.display = this.state ? "block" : "none";
  };

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      this.onFileClick();
    }
  });

  this.$target.addEventListener("click", (e) => {
    if (e.target.tagName === "DIV") {
      this.onFileClick();
    }
  });

  this.render();
}
