export default function Nodes({ $app, initialState, onClick, onBackClick }) {
    // Nodes의 컴포넌트는 상태를 가지고
    this.state = initialState;
  
    // 컴포넌트간 조율하는 콜백함수
    this.onClick = onClick;
    this.onBackClick = onBackClick;
  
    // 가장 기본이되는 컴포넌트 가장위를 만듬
    this.$target = document.createElement("div");
    this.$target.className = "Nodes";
  
    // 만들고 기준이되는 Root에 추가함
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
  