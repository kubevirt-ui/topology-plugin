import React, { FC, useContext } from 'react';

import { observer } from '@patternfly/react-topology';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import { ExtensibleModel, ModelContext } from '../../data-transforms/ModelContext';
import { TopologyViewType } from '../../utils/types/topology-types';
import StatusBox from '../common/StatusBox/StatusBox';

import { DroppableTopologyComponent } from './DroppableTopologyComponent';

interface TopologyDataRendererProps {
  viewType: TopologyViewType;
}

const TopologyDataRenderer: FC<TopologyDataRendererProps> = observer(function TopologyDataRenderer({
  viewType,
}) {
  const { t } = useTopologyTranslation();
  const { namespace, model, loaded, loadError } = useContext<ExtensibleModel>(ModelContext);

  return (
    <StatusBox
      skeleton={
        viewType === TopologyViewType.list && (
          <div className="co-m-pane__body skeleton-overview">
            <div className="skeleton-overview--head" />
            <div className="skeleton-overview--tile" />
            <div className="skeleton-overview--tile" />
            <div className="skeleton-overview--tile" />
          </div>
        )
      }
      data={model}
      label={t('Topology')}
      loaded={loaded}
      loadError={loadError}
    >
      <DroppableTopologyComponent viewType={viewType} model={model} namespace={namespace} />
    </StatusBox>
  );
});

export default TopologyDataRenderer;
