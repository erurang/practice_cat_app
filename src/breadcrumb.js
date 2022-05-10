export default function Breadcrumb({ $app, initialState, onPathClick }) {
  this.state = initialState;
  this.onPathClick = onPathClick;

  this.$target = document.createElement("nav");
  this.$target.className = "Breadcrumb";
  $app.appendChild(this.$target);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    this.$target.innerHTML = `<div class='nav-item'>root</div> 
              ${this.state
                .map(
                  (node) =>
                    `<div class="nav-item" data-index="${node.id}">${node.name}</div>`
                )
                .join("")}
          `;
  };

  this.$target.addEventListener("click", (e) => {
    const { index } = e.target.dataset;

    if (!index) {
      this.onPathClick("root");
    } else {
      this.onPathClick(index);
    }
  });

  this.render();
}
