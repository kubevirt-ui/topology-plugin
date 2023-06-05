import React, { FC, ReactNode } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import {
  Button,
  DataList,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Tooltip,
  TooltipPosition,
} from '@patternfly/react-core';
import { Node, observer } from '@patternfly/react-topology';
import { getResource, getResourceKind } from '@topology-utils';
import { getFiringAlerts, getSeverityAlertType } from '@topology-utils/alert-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import { useSearchFilter } from '../../filters';
import AlertSeverityIcon from '../common/AlertSeverityIcon';

import {
  AlertsCell,
  CpuCell,
  GroupResourcesCell,
  MemoryCell,
  StatusCell,
  TypedResourceBadgeCell,
} from './cells';

type DispatchProps = {
  onSelectTab?: (name: string) => void;
};

type TopologyListViewNodeProps = {
  item: Node;
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  badgeCell?: ReactNode;
  labelCell?: ReactNode;
  alertsCell?: ReactNode;
  memoryCell?: ReactNode;
  cpuCell?: ReactNode;
  statusCell?: ReactNode;
  groupResourcesCell?: ReactNode;
  hideAlerts?: boolean;
  noPods?: boolean;
};

const TopologyListViewNode: FC<TopologyListViewNodeProps & DispatchProps> = ({
  item,
  selectedIds,
  onSelect,
  onSelectTab,
  badgeCell,
  labelCell,
  alertsCell,
  memoryCell,
  cpuCell,
  statusCell,
  groupResourcesCell,
  hideAlerts = false,
  noPods = false,
  children,
}) => {
  const { t } = useTopologyTranslation();
  const [filtered] = useSearchFilter(item.getLabel(), getResource(item)?.metadata?.labels);
  if (!item.isVisible) {
    return null;
  }
  const kind = getResourceKind(item);

  let alertIndicator = null;
  const alerts = getFiringAlerts(item.getData().data?.monitoringAlerts ?? []);
  if (alerts?.length > 0) {
    const onAlertClick = () => {
      onSelect([item.getId()]);
      onSelectTab('Observe');
    };
    const severityAlertType = getSeverityAlertType(alerts);
    alertIndicator = shouldHideMonitoringAlertDecorator(severityAlertType) ? null : (
      <Tooltip
        key="monitoringAlert"
        content={t('Monitoring alert')}
        position={TooltipPosition.right}
      >
        <Button
          variant="plain"
          className="odc-topology-list-view__alert-button"
          onClick={onAlertClick}
        >
          <AlertSeverityIcon severityAlertType={severityAlertType} />
        </Button>
      </Tooltip>
    );
  }

  const cells = [];
  cells.push(
    labelCell || (
      <DataListCell
        className="odc-topology-list-view__label-cell"
        key="label"
        id={`${item.getId()}_label`}
      >
        {badgeCell || <TypedResourceBadgeCell key="type-icon" kind={kind} />}
        {item.getLabel()}
        {alertIndicator}
      </DataListCell>
    ),
  );
  if (item.isGroup()) {
    if (item.isCollapsed()) {
      cells.push(groupResourcesCell || <GroupResourcesCell key="resources" group={item} />);
    }
  } else {
    if (!hideAlerts) {
      cells.push(alertsCell || <AlertsCell key="alerts" item={item} />);
    }
    if (!noPods) {
      if (!selectedIds[0]) {
        cells.push(memoryCell || <MemoryCell key="memory" item={item} />);
        cells.push(cpuCell || <CpuCell key="cpu" item={item} />);
      }
      cells.push(statusCell || <StatusCell key="status" item={item} />);
    }
  }

  const className = classNames('odc-topology-list-view__item-row', { 'is-filtered': filtered });
  return (
    <DataListItem
      key={item.getId()}
      id={item.getId()}
      aria-labelledby={`${item.getId()}_label`}
      isExpanded={children !== undefined}
    >
      <DataListItemRow className={className}>
        <DataListItemCells dataListCells={cells} />
      </DataListItemRow>
      {children ? (
        <DataListContent
          className="odc-topology-list-view__group-children"
          aria-label={t('{{kindLabel}} {{label}}', {
            label: item.getLabel(),
            kindLabel: getK8sModel(kind)?.label ?? kind,
          })}
          id={`${item.getId()}-${item.getLabel()}`}
          isHidden={false}
        >
          <DataList
            aria-label={t('{{label}} sub-resources', { label: item.getLabel() })}
            selectedDataListItemId={selectedIds[0]}
            onSelectDataListItem={(id) => onSelect(selectedIds[0] === id ? [] : [id])}
          >
            {children}
          </DataList>
        </DataListContent>
      ) : null}
    </DataListItem>
  );
};

const TopologyListViewNodeDispatchToProps = (dispatch): DispatchProps => ({
  onSelectTab: (name) => dispatch(selectOverviewDetailsTab(name)),
});

export default connect<{}, DispatchProps, TopologyListViewNodeProps>( // eslint-disable-line @typescript-eslint/ban-types
  null,
  TopologyListViewNodeDispatchToProps,
)(observer(TopologyListViewNode));
