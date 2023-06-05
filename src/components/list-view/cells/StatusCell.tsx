import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { DaemonSetModel } from '@kubevirt-ui/kubevirt-api/console';
import { DataListCell } from '@patternfly/react-core';
import { Node } from '@patternfly/react-topology';
import { getTopologyResourceObject } from '@topology-utils';
import usePodsWatcher from '@topology-utils/hooks/usePodsWatcher/usePodsWatcher';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';
import { PodKind, PodRCData } from '@topology-utils/types/podTypes';

import './StatusCell.scss';

type StatusCellResourceLinkProps = {
  desired: number;
  ready: number;
  resource: K8sResourceKind;
};

const StatusCellResourceLink: FC<StatusCellResourceLinkProps> = ({
  desired = 0,
  ready = 0,
  resource,
}) => {
  const { t } = useTopologyTranslation();
  const href = `${resourceObjPath(resource, resource.kind)}/pods`;
  return (
    <Link to={href}>
      {t('{{ready, number}} of {{count, number}} Pod', { ready, count: desired })}
    </Link>
  );
};

interface StatusCellResourceStatus {
  obj: K8sResourceKind;
  podData: PodRCData;
}

const StatusCellResourceStatus: FC<StatusCellResourceStatus> = ({ obj, podData }) => {
  const { t } = useTopologyTranslation();
  if (obj.kind === DaemonSetModel.kind) {
    return (
      <StatusCellResourceLink
        desired={obj?.status?.desiredNumberScheduled}
        ready={obj?.status?.currentNumberScheduled}
        resource={obj}
      />
    );
  }
  if (obj.spec?.replicas === undefined) {
    const href = `${resourceObjPath(obj, obj.kind)}/pods`;
    const filteredPods = podData.pods?.filter((p) => podPhase(p as PodKind) !== 'Completed') ?? [];
    if (!filteredPods.length) {
      return null;
    }
    return <Link to={href}>{t('{{length}} Pods', { length: filteredPods.length })}</Link>;
  }

  return podData.isRollingOut ? (
    <span className="text-muted">{t('Rollout in progress...')}</span>
  ) : (
    <StatusCellResourceLink
      desired={obj.spec.replicas}
      ready={obj.status.replicas}
      resource={podData.current ? podData.current.obj : obj}
    />
  );
};

type StatusProps = {
  item: Node;
};

const StatusCell: FC<StatusProps> = ({ item }) => {
  const resource = getTopologyResourceObject(item.getData());
  const { podData, loaded, loadError } = usePodsWatcher(resource);

  return (
    <DataListCell id={`${item.getId()}_status`}>
      <div className="odc-topology-list-view__detail--status">
        {loaded && !loadError ? (
          <StatusCellResourceStatus obj={resource} podData={podData} />
        ) : null}
      </div>
    </DataListCell>
  );
};

export { StatusCell, StatusCellResourceStatus };
