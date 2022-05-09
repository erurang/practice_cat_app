// breadcrumb 에 div 자식마다 a - b - c 로 이어짐.
// "https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public/${filePath}"

const API_END_POINT =
  "https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev/";

async function request() {
  // fetch로 반환되는  promise 객체는 http Error상태를 reject 해주지않기때문에. 즉 네트워크 요청에 오류가생겨도 catch에 걸리지 않는다는뜻.
  //  response.ok로 파악해야함
  try {
    const data = await fetch(
      "https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev/"
    );

    if (!data.ok) {
      alert("서버에서 데이터를 받아오는데 오류가 있습니다.");
      throw new Error(`서버의 상태가 이상함!`);
    }

    return await data.json();
  } catch (e) {
    alert("이상한오류!!");
    throw new Error(`request오류! ${e}`);
  }
}
// 이런식으로 DOM에 직접 접근하는 방식을 명령적 프로그래밍 이라고함
// -> 추상적이지 못하다.
// -> 나중에 UI가 커질경우 어느지점 어느 시점에서 DOM을 업데이트 하는지 추적하는게 점점 힘들어짐
// ---> 그래서 상태를 가져서 상태를 기준으로 DOM을 업데이트 해보자!

// 컴포넌트를 둘로 나눴더니..
// 문제에서 요구하는 node에서 클릭하면 파일을 보여주거나 경로를 이동하는 부분
// + 변경이 일어나면 breadcrumb의 경로 변경 업데이트가 필요함.

// 이 경우에는 어떻게 해야할까?
// nodes컴포넌트에 breadcrumb를 종속시켜야하나? 아니면 반대로 breadcrumb에 nodes를 종속시켜야하나?
// ----> 컴포넌트간의 의존성 증가!! 나중에 독립적으로 컴포넌트를 사용하기 어려워짐!
// === > 즉 두 컴포넌트를 감싸는 하나의 컴포넌트를 만들자!

function App($app) {
  this.state = {
    isRoot: false,
    nodes: [],
    depth: [],
  };

  const onClick = (node) => {
    console.log(node)
    if (node.type === "DIRECTORY") {
        
    } else if (node.type === "FILE") {
    }
  };

  const breadcrumb = new Breadcrumb({ $app, initialState: this.state.depth });

  const nodes = new Nodes({
    $app,
    initialState: { isRoot: this.state.isRoot, nodes: this.state.nodes },
    onClick,
  });

  //app 에도 상태관리를위해 setState함수 설정
  this.setState = (nextState) => {

    this.state = nextState;
    breadcrumb.setState(this.state.depth);
    nodes.setState({ isRoot: this.state.isRoot, nodes : this.state.nodes});
  };

  // 초기 데이터 셋팅

  this.init = async () => {
    try {
      const rootNodes = await request();

      this.setState({
        ...this.state,
        isRoot: true,
        nodes: rootNodes,
      });
    } catch (e) {
      throw new Error(e);
    }
  };

  this.init();
}

function Nodes({ $app, initialState, onClick }) {

    
  // Nodes의 컴포넌트는 상태를 가지고
  this.state = initialState;

  // 컴포넌트간 조율하는 콜백함수
  this.onClick = onClick;

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
    console.log(this.state)
    if (this.state.nodes) {    
      const nodeTemplate = this.state.nodes
        .map((node, index) => {
          const iconPath =
            node.type === "FILE"
              ? "./assets/file.png"
              : "./assets/directory.png";
          return `<div class="Node" data-index="${index}"><img src="${iconPath}"><div>${node.name}</div></div>`;
        })
        .join("");

      this.$target.innerHTML = !this.state.isRoot
        ? `<div class="Node><img src="./assets/prev.png></div> ${nodeTemplate}`
        : nodeTemplate;
    }

    this.$target.querySelectorAll(".Node").forEach(($node) => {
      console.log($node.dataset);
      $node.addEventListener("click", (e) => {
        const { index } = e.target.dataset;

        const selectIndex = this.state.nodes.find((node) => node.id === index);

        if (selectIndex) {
          this.onClick(selectedNode);
        }
      });
    });
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
            ${this.state
              .map(
                (node, index) =>
                  `<div class="nav-item" data-index="${index}">${node.name}</div>`
              )
              .join("")}
        `;
  };

  this.render();
}

new App(document.querySelector(".app"));
