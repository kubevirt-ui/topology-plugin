import {
  ColaGroup,
  ColaLayout,
  ColaLink,
  ColaNode,
  Graph,
  GraphModel,
} from '@patternfly/react-topology';
import { layoutConstraints } from '@topology-utils/layout-constraints';

class TopologyColaLayout extends ColaLayout {
  protected getConstraints(nodes: ColaNode[], groups: ColaGroup[], edges: ColaLink[]): any[] {
    return layoutConstraints(nodes, groups, edges, this.options);
  }

  protected startLayout(
    graph: Graph<GraphModel, any>,
    initialRun: boolean,
    addingNodes: boolean,
  ): void {
    if (graph.getNodes()?.filter((n) => n.isVisible()).length === 0) {
      return;
    }
    super.startLayout(graph, initialRun, addingNodes);
  }
}

export default TopologyColaLayout;
