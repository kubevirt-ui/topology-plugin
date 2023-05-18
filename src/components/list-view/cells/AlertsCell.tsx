import React, { FC, useMemo } from 'react';
import groupBy from 'lodash.groupby';

import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
import { DataListCell, Tooltip } from '@patternfly/react-core';
import { Node } from '@patternfly/react-topology';
import { useBuildConfigsWatcher } from '@topology-utils/hooks/useBuildsConfigWatcher/useBuildsConfigWatcher';
import usePodsWatcher from '@topology-utils/hooks/usePodsWatcher/usePodsWatcher';
import useReplicationControllersWatcher from '@topology-utils/hooks/useReplicationControllersWatcher';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import {
  getBuildAlerts,
  getReplicationControllerAlerts,
  getResourcePausedAlert,
} from '@topology-utils/resource-utils';
import { OverviewItemAlerts } from '@topology-utils/types/podTypes';

import { getResource, uniq } from '../../../utils';
import useIsMobile from '../../page/TopologyPageToolbar/hooks/useIsMobile/useIsMobile';
import { useResourceQuotaAlert } from '../../workload';

import './AlertsCell.scss';

type AlertsProps = {
  item: Node;
};

const AlertTooltip = ({ alerts, severity, isMobile }) => {
  if (!alerts) {
    return null;
  }

  const count = alerts.length;
  const message = uniq(alerts.map((a) => a.message)).join('\n');

  const status = (
    <span className="odc-topology-list-view__alert-cell--status">
      <Status status={severity} title={String(count)} />
    </span>
  );

  // No tooltip on mobile since a touch also opens the sidebar, which
  // immediately covers the tooltip content.
  if (isMobile) {
    return status;
  }

  const tipContent = [
    <span key="message" className="co-pre-wrap">
      {message}
    </span>,
  ];
  return (
    <Tooltip content={tipContent} distance={10}>
      {status}
    </Tooltip>
  );
};

const AlertsCell: FC<AlertsProps> = ({ item }) => {
  const { t } = useTopologyTranslation();
  const isMobile = useIsMobile();
  const resource = getResource(item);
  const { podData, loaded } = usePodsWatcher(resource);
  const { buildConfigs, loaded: buildConfigsLoaded } = useBuildConfigsWatcher(resource);
  const { loaded: rcsLoaded, mostRecentRC } = useReplicationControllersWatcher(resource);
  const workloadRqAlert = useResourceQuotaAlert(item);
  const workloadRqAlerts: OverviewItemAlerts = workloadRqAlert
    ? {
        rqAlert: {
          message: workloadRqAlert.content as string,
          severity: workloadRqAlert.variant,
        },
      }
    : {};

  const currentAlerts = useMemo(() => {
    if (loaded && podData.current) {
      return podData.current.alerts;
    }
    return {};
  }, [loaded, podData]);

  const previousAlerts = useMemo(() => {
    if (loaded && podData.previous) {
      return podData.current.alerts;
    }
    return {};
  }, [loaded, podData]);

  const buildConfigAlerts = useMemo(() => {
    if (buildConfigsLoaded && buildConfigs) {
      return getBuildAlerts(buildConfigs);
    }
    return {};
  }, [buildConfigsLoaded, buildConfigs]);

  const rollOutAlerts = useMemo(() => {
    if (rcsLoaded && mostRecentRC) {
      return getReplicationControllerAlerts(mostRecentRC);
    }
    return {};
  }, [mostRecentRC, rcsLoaded]);

  const alerts = {
    ...getResourcePausedAlert(resource),
    ...rollOutAlerts,
    ...buildConfigAlerts,
    ...currentAlerts,
    ...previousAlerts,
    ...workloadRqAlerts,
  };

  if (alerts?.length) {
    return null;
  }

  const { error, warning, info, buildNew, buildPending, buildRunning, buildFailed, buildError } =
    groupBy(alerts, 'severity');
  return (
    <DataListCell id={`${item.getId()}_alerts`}>
      <div className="odc-topology-list-view__alert-cell">
        {(error || warning || info) && (
          <div className="odc-topology-list-view__alert-cell__status">
            <span className="odc-topology-list-view__alert-cell__label">{t('Alerts:')}</span>
            <AlertTooltip severity="Error" alerts={error} isMobile={isMobile} />
            <AlertTooltip severity="Warning" alerts={warning} isMobile={isMobile} />
            <AlertTooltip severity="Info" alerts={info} isMobile={isMobile} />
          </div>
        )}
        {(buildNew || buildPending || buildRunning || buildFailed || buildError) && (
          <div className="odc-topology-list-view__alert-cell__status">
            <span className="odc-topology-list-view__alert-cell__label">{t('Builds:')}</span>
            <AlertTooltip severity="New" alerts={buildNew} isMobile={isMobile} />
            <AlertTooltip severity="Pending" alerts={buildPending} isMobile={isMobile} />
            <AlertTooltip severity="Running" alerts={buildRunning} isMobile={isMobile} />
            <AlertTooltip severity="Failed" alerts={buildFailed} isMobile={isMobile} />
            <AlertTooltip severity="Error" alerts={buildError} isMobile={isMobile} />
          </div>
        )}
      </div>
    </DataListCell>
  );
};

export default AlertsCell;
