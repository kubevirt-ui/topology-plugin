import React, { FC, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  AppliedClusterResourceQuotaModel,
  ResourceQuotaModel,
} from '@kubevirt-ui/kubevirt-api/console';
import {
  useK8sWatchResources,
  YellowExclamationTriangleIcon,
} from '@openshift-console/dynamic-plugin-sdk';
import { Label } from '@patternfly/react-core';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import { resourcePathFromModel } from '../../../../cdi-upload-provider/utils/utils';
import useTelemetry from '../../../utils/hooks/useTelemetry/useTelemetry';
import { checkQuotaLimit } from '../../utils/checkResourceQuota';

import { AppliedClusterResourceQuotaKind, ResourceQuotaKind } from './types/types';

export interface ResourceQuotaAlertProps {
  namespace: string;
}

const ResourceQuotaAlert: FC<ResourceQuotaAlertProps> = ({ namespace }) => {
  const { t } = useTopologyTranslation();
  const fireTelemetryEvent = useTelemetry();
  const [warningMessageFlag, setWarningMessageFlag] = useState<boolean>();
  const [resourceQuotaName, setResourceQuotaName] = useState(null);
  const [resourceQuotaKind, setResourceQuotaKind] = useState(null);

  const watchedResources = useMemo(
    () => ({
      resourcequotas: {
        groupVersionKind: {
          kind: ResourceQuotaModel.kind,
          version: ResourceQuotaModel.apiVersion,
        },
        namespace,
        isList: true,
      },
      appliedclusterresourcequotas: {
        groupVersionKind: {
          kind: AppliedClusterResourceQuotaModel.kind,
          version: AppliedClusterResourceQuotaModel.apiVersion,
          group: AppliedClusterResourceQuotaModel.apiGroup,
        },
        namespace,
        isList: true,
      },
    }),
    [namespace],
  );

  const { resourcequotas, appliedclusterresourcequotas } = useK8sWatchResources<{
    resourcequotas: ResourceQuotaKind[];
    appliedclusterresourcequotas: AppliedClusterResourceQuotaKind[];
  }>(watchedResources);

  const [totalRQatQuota = [], quotaName, quotaKind] = useMemo(
    () =>
      resourcequotas.loaded && !resourcequotas.loadError
        ? checkQuotaLimit(resourcequotas.data)
        : [],
    [resourcequotas],
  );

  const [totalACRQatQuota = [], clusterRQName, clusterRQKind] = useMemo(
    () =>
      appliedclusterresourcequotas.loaded && !appliedclusterresourcequotas.loadError
        ? checkQuotaLimit(appliedclusterresourcequotas.data)
        : [],
    [appliedclusterresourcequotas],
  );

  const totalResourcesAtQuota = useMemo(
    () =>
      [...totalRQatQuota, ...totalACRQatQuota].filter((resourceAtQuota) => resourceAtQuota !== 0),
    [totalRQatQuota, totalACRQatQuota],
  );

  useEffect(() => {
    if (totalResourcesAtQuota.length === 1) {
      setResourceQuotaName(quotaName || clusterRQName);
      setResourceQuotaKind(quotaKind || clusterRQKind);
    } else {
      setResourceQuotaName(null);
      setResourceQuotaKind(null);
    }
  }, [clusterRQKind, clusterRQName, totalResourcesAtQuota, quotaKind, quotaName]);

  useEffect(() => {
    if (totalResourcesAtQuota.length > 0) {
      setWarningMessageFlag(true);
    } else {
      setWarningMessageFlag(false);
    }
  }, [totalResourcesAtQuota]);

  const getRedirectLink = () => {
    if (resourceQuotaName && resourceQuotaKind === AppliedClusterResourceQuotaModel.kind) {
      return resourcePathFromModel(AppliedClusterResourceQuotaModel, resourceQuotaName, namespace);
    }
    if (resourceQuotaName) {
      return resourcePathFromModel(ResourceQuotaModel, resourceQuotaName, namespace);
    }
    return resourcePathFromModel(ResourceQuotaModel, null, namespace);
  };

  const onResourceQuotaLinkClick = () => {
    fireTelemetryEvent('Resource Quota Warning Label Clicked');
  };

  return (
    <>
      {warningMessageFlag && resourcequotas.loaded && appliedclusterresourcequotas.loaded ? (
        <Label color="orange" icon={<YellowExclamationTriangleIcon />}>
          <Link
            to={getRedirectLink()}
            data-test="resource-quota-warning"
            onClick={onResourceQuotaLinkClick}
          >
            {t('{{count}} resource reached quota', {
              count: totalResourcesAtQuota.reduce((a, b) => a + b, 0),
            })}
          </Link>
        </Label>
      ) : null}
    </>
  );
};

export default ResourceQuotaAlert;
