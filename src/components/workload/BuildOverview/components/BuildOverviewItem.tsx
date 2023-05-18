import React, { FC } from 'react';

import { StatusIconAndText } from '@openshift-console/dynamic-plugin-sdk';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
import { SyncAltIcon } from '@patternfly/react-icons';
import { fromNow } from '@topology-utils/datetime';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import BuildLogLink from './BuildLogLink';
import BuildStatus from './BuildStatus';
import StatusTitle from './StatusTitle';

type BuildOverviewListItemProps = {
  build: K8sResourceKind;
};

const BuildOverviewItem: FC<BuildOverviewListItemProps> = ({ build }) => {
  const {
    metadata: { creationTimestamp },
    status: { completionTimestamp, startTimestamp, phase },
  } = build;
  const lastUpdated = completionTimestamp || startTimestamp || creationTimestamp;
  return (
    <li className="list-group-item build-overview__item">
      <div className="build-overview__item-title">
        <div className="build-overview__status co-icon-and-text">
          <div className="co-icon-and-text__icon co-icon-flex-child">
            {phase === 'Running' ? (
              <StatusIconAndText icon={<SyncAltIcon />} title={phase} spin iconOnly />
            ) : (
              <Status status={phase} iconOnly />
            )}
          </div>
          <div>
            <StatusTitle build={build} />
            {lastUpdated && (
              <>
                {' '}
                <span className="build-overview__item-time text-muted">
                  ({fromNow(lastUpdated)})
                </span>
              </>
            )}
          </div>
        </div>
        <div>
          <BuildLogLink build={build} />
        </div>
      </div>
      <BuildStatus build={build} />
    </li>
  );
};

export default BuildOverviewItem;
