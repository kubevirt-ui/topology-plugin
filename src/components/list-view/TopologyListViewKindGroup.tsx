import React, { FC } from 'react';

import {
  DataList,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
} from '@patternfly/react-core';
import { GraphElement, isNode, Node, observer } from '@patternfly/react-topology';
import { labelKeyForNodeKind } from '@topology-utils/common-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import ListElementWrapper from './ListElementWrapper';

interface TopologyListViewKindGroupProps {
  groupLabel: string;
  kind: string;
  childElements: GraphElement[];
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
}

const TopologyListViewKindGroup: FC<TopologyListViewKindGroupProps> = ({
  groupLabel,
  kind,
  childElements,
  selectedIds,
  onSelect,
}) => {
  const { t } = useTopologyTranslation();
  const resourceLabel = labelKeyForNodeKind(kind);

  const childNodes = childElements.filter((n) => isNode(n)) as Node[];
  childNodes.sort((a, b) => a.getLabel().localeCompare(b.getLabel()));

  return (
    <DataListItem
      key={kind}
      aria-labelledby={`${groupLabel}-${resourceLabel}-label`.replace(' ', '-')}
      isExpanded
    >
      <DataListItemRow className="odc-topology-list-view__kind-row">
        <DataListItemCells
          dataListCells={[
            <DataListCell
              key={kind}
              className="odc-topology-list-view__kind-label"
              id={`${groupLabel}-${resourceLabel}-label`.replace(' ', '-')}
            >
              {resourceLabel}
            </DataListCell>,
          ]}
        />
      </DataListItemRow>
      <DataListContent
        aria-label={t('{{groupLabel}} {{resourceLabel}}', {
          groupLabel,
          resourceLabel,
        })}
        id={`${groupLabel}-${resourceLabel}`}
        isHidden={false}
      >
        <DataList
          aria-label={t('{{resourceLabel}} sub-resources', { resourceLabel })}
          selectedDataListItemId={selectedIds[0]}
          onSelectDataListItem={(id) => onSelect(selectedIds[0] === id ? [] : [id])}
        >
          {childNodes.map((child) => (
            <ListElementWrapper
              key={child.getId()}
              item={child}
              selectedIds={selectedIds}
              onSelect={onSelect}
            />
          ))}
        </DataList>
      </DataListContent>
    </DataListItem>
  );
};

export default observer(TopologyListViewKindGroup);
