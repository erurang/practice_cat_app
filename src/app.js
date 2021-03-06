import Breadcrumb from "./breadcrumb.js";
import Nodes from "./nodes.js";
import Loading from "./loading.js";
import ImageViewer from "./imageViwer.js";
import { request } from "./api.js";

export default function App($app, cache) {
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
        if (cache[node.id]) {
          this.setState({
            ...this.state,
            depth: [...this.state.depth, node],
            nodes: cache[node.id],
          });
        } else {
          const nextNodes = await request(node.id);

          this.setState({
            ...this.state,
            depth: [...this.state.depth, node],
            nodes: nextNodes,
          });

          cache[node.id] = nextNodes;
        }
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
        this.setState({
          ...nextState,
          isRoot: true,
          nodes: cache.root,
        });
      } else {
        this.setState({
          ...nextState,
          isRoot: false,
          nodes: cache[prevNodeId],
        });
      }
    } catch (e) {
      throw new Error(e);
    } finally {
      this.setState({ ...this.state, loading: false });
    }
  };

  const onFileClick = () => {
    this.setState({ ...this.state, selectedFilePath: null });
  };

  const onPathClick = (nodeId) => {
    if (nodeId === "root") {
      this.setState({
        ...this.state,
        isRoot: true,
        nodes: cache.root,
        depth: [],
      });
    } else {
      const index = this.state.depth.findIndex((depth) => depth.id === nodeId);
      this.setState({
        ...this.state,
        isRoot: false,
        nodes: cache[nodeId],
        depth: this.state.depth.slice(0, index + 1),
      });
    }
  };

  const breadcrumb = new Breadcrumb({
    $app,
    initialState: this.state.depth,
    onPathClick,
  });

  const nodes = new Nodes({
    $app,
    initialState: { isRoot: this.state.isRoot, nodes: this.state.nodes },
    onClick,
    onBackClick,
  });

  const imageViewer = new ImageViewer({
    $app,
    initialState: this.state.selectedFilePath,
    onFileClick,
  });

  const loading = new Loading({
    $app,
    initialState: this.state.loading,
  });

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

  this.init = async () => {
    try {
      this.setState({
        ...this.state,
        loading: true,
      });

      const rootNodes = await request();

      cache.root = rootNodes;

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
