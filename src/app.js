import Breadcrumb from "./breadcrumb.js"
import Nodes from "./nodes.js"
import Loading from "./loading.js"
import ImageViewer from "./imageViwer.js"
import { request } from "./api.js"


export default function App($app) {
    this.state = {
      isRoot: false,
      nodes: [],
      depth: [],
      selectedFilePath: null,
      loading: false,
    };
    const onClick = async (node) => {
      try {
        this.setState({ ...this.state, loading: true });
        if (node.type === "DIRECTORY") {
          const nextNodes = await request(node.id);
  
          this.setState({
            ...this.state,
            depth: [...this.state.depth, node],
            nodes: nextNodes,
          });
        } else if (node.type === "FILE") {
          this.setState({
            ...this.state,
            selectedFilePath: node.filePath,
          });
        }
      } catch (e) {
        throw new Error(e);
      } finally {
        this.setState({ ...this.state, loading: false });
      }
    };
  
    const onBackClick = async () => {
      try {
        this.setState({ ...this.state, loading: true });
        const nextState = { ...this.state };
        nextState.depth.pop();
  
        const prevNodeId =
          nextState.depth.length === 0
            ? null
            : nextState.depth[nextState.depth.length - 1].id;
  
        if (prevNodeId === null) {
          const rootNodes = await request();
          this.setState({
            ...nextState,
            isRoot: true,
            nodes: rootNodes,
          });
        } else {
          const prevNodes = await request(prevNodeId);
  
          this.setState({
            ...nextState,
            isRoot: false,
            nodes: prevNodes,
          });
        }
      } catch (e) {
        throw new Error(e);
      } finally {
        this.setState({ ...this.state, loading: false });
      }
    };
  
    const breadcrumb = new Breadcrumb({ $app, initialState: this.state.depth });
  
    const nodes = new Nodes({
      $app,
      initialState: { isRoot: this.state.isRoot, nodes: this.state.nodes },
      onClick,
      onBackClick,
    });
  
    const imageViewer = new ImageViewer({
      $app,
      initialState: this.state.selectedFilePath,
    });
  
    const loading = new Loading({
      $app,
      initialState: this.state.loading,
    });
  
    //app 에도 상태관리를위해 setState함수 설정
    this.setState = (nextState) => {
      this.state = nextState;
      breadcrumb.setState(this.state.depth);
      nodes.setState({
        isRoot: this.state.depth.length === 0 ? true : false,
        nodes: this.state.nodes,
      });
      imageViewer.setState(this.state.selectedFilePath);
      loading.setState(this.state.loading);
    };
  
    // 초기 데이터 셋팅
  
    this.init = async () => {
      try {
        this.setState({
          ...this.state,
          loading: true,
        });
  
        const rootNodes = await request();
  
        this.setState({
          ...this.state,
          isRoot: true,
          nodes: rootNodes,
        });
      } catch (e) {
        throw new Error(e);
      } finally {
        this.setState({
          ...this.state,
          loading: false,
        });
      }
    };
  
    this.init();
  }