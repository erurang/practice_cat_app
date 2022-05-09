// breadcrumb 에 div 자식마다 a - b - c 로 이어짐.
// "https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public/${filePath}"

async function getRootData() {
  const data = await fetch(
    "https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev/"
  );
  const jsonData = await data.json();
  return await jsonData;
}

// 이런식으로 DOM에 직접 접근하는 방식을 명령적 프로그래밍 이라고함
// -> 추상적이지 못하다.
// -> 나중에 UI가 커질경우 어느지점 어느 시점에서 DOM을 업데이트 하는지 추적하는게 점점 힘들어짐
// ---> 그래서 상태를 가져서 상태를 기준으로 DOM을 업데이트 해보자!

// app 컨테이너를 받고 기존 상태를 받음.
function Nodes({ $app, initialState }) {
  // Nodes의 컴포넌트는 상태를 가지고
  this.state = initialState;

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
    this.$target.innerHTML = this.state.nodes
      .map((node) => {
        if (node.type === "DIRECTORY") {
          return `<div class="Node"><img src="./assets/directory.png"><div>${node.name}</div></div>`;
        } else {
          return `<div class="Node"><img src="./assets/file.png"><div>${node.name}</div></div>`;
        }
      })
      .join("");
  };

  this.render();
}

function Breadcrumb({ $app, initialState }) {
  this.state = initialState;

  this.$target = document.createElement("nav");
  this.$target.className = "Breadcrumb";
  $app.appendChild(this.$target);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    this.$target.innerHTML = `<div class='nav-item'>root</div> 
            ${this.state.nodes
              .map(
                (node, index) =>
                  `<div class="nav-item" data-index=${index}>${node.name}</div>`
              )
              .join("")}
        `;
  };

  this.render();
}

const $app = document.querySelector(".App");

const initialState = {
  nodes: [],
};

const breadComp = new Breadcrumb({ $app, initialState });
const nodesComp = new Nodes({ $app, initialState });

// {}로 하면 이름이 같은것끼리 연결되서 굳이 parameter 순서를 맞출 이유가 없음
// const test = new Nodes({ initialState, $app });