export default function Nodes({ $app, initialState, onClick, onBackClick }) {
  
  this.state = initialState;

  
  this.onClick = onClick;
  this.onBackClick = onBackClick;

  
  this.$target = document.createElement("div");
  this.$target.className = "Nodes";

  
  $app.appendChild(this.$target);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    if (this.state.nodes) {
      const nodeTemplate = this.state.nodes
        .map((node) => {
          const iconPath =
            node.type === "FILE"
              ? "./assets/file.png"
              : "./assets/directory.png";
          return `<div class="Node" data-index="${node.id}"><img src="${iconPath}"><div>${node.name}</div></div>`;
        })
        .join("");

      this.$target.innerHTML = !this.state.isRoot
        ? `<div class="Node"><img src="./assets/prev.png"></div> ${nodeTemplate}`
        : nodeTemplate;
    }
  };

  this.$target.addEventListener("click", (e) => {
    const $node = e.target.closest(".Node");

    if ($node) {
      const { index } = $node.dataset;

      if (!index) {
        this.onBackClick();
        return;
      }

      const select = this.state.nodes.find((node) => node.id === index);

      if (select) {
        this.onClick(select);
        return;
      }
    }
  });

  this.render();
}
