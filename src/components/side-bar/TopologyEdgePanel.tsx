/**
 * @deprecated This file needs to be removed after migrating the Traffic connector side-panel to dynamic extensions
 */
import React, { FC } from 'react';
import classNames from 'classnames';

import { Edge, isNode, Node } from '@patternfly/react-topology';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import { edgeActions } from '../../actions';
import { TYPE_TRAFFIC_CONNECTOR } from '../../const';

import TopologyEdgeResourcesPanel from './TopologyEdgeResourcesPanel';

type TopologyEdgePanelProps = {
  edge: Edge;
};

const connectorTypeToTitleKey = (type: string): string => {
  switch (type) {
    case TYPE_TRAFFIC_CONNECTOR:
      // t('Traffic connector')
      return 'Traffic connector';
    default:
      return '';
  }
};

const TopologyEdgePanel: FC<TopologyEdgePanelProps> = ({ edge }) => {
  const { t } = useTopologyTranslation();
  const nodes = edge
    .getController()
    .getElements()
    .filter((e) => isNode(e) && !e.isGroup()) as Node[];

  return (
    <div className="overview__sidebar-pane resource-overview">
      <div className="overview__sidebar-pane-head resource-overview__heading">
        <h1 className="co-m-pane__heading">
          <div className="co-m-pane__name co-resource-item">
            {t(connectorTypeToTitleKey(edge.getType()))}
          </div>
          <div className="co-actions">
            <ActionsMenu actions={edgeActions(edge, nodes)} />
          </div>
        </h1>
      </div>
      <ul
        className={classNames(
          'co-m-horizontal-nav__menu',
          'co-m-horizontal-nav__menu--within-sidebar',
          'co-m-horizontal-nav__menu--within-overview-sidebar',
          'odc-application-resource-tab',
        )}
      >
        <li className="co-m-horizontal-nav__menu-item">
          <button type="button">{t('Resources')}</button>
        </li>
      </ul>
      <TopologyEdgeResourcesPanel edge={edge} />
    </div>
  );
};

export default TopologyEdgePanel;
