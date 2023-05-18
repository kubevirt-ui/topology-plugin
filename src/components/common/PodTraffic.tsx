import React from 'react';

import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
import { Tooltip } from '@patternfly/react-core';
import { ConnectedIcon, DisconnectedIcon } from '@patternfly/react-icons';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import { EndpointSliceKind, EndPointSliceModel } from '../../models/EndPointSliceModel';

import LoadingInline from './LoadingInline/LoadingInline';

export type PodTrafficProp = {
  podName: string;
  namespace: string;
  tooltipFlag?: boolean;
};

const PodTraffic: React.FC<PodTrafficProp> = ({ podName, namespace, tooltipFlag }) => {
  const { t } = useTopologyTranslation();
  const [data, loaded, loadError] = useK8sWatchResource<EndpointSliceKind[]>({
    groupVersionKind: {
      kind: EndPointSliceModel.kind,
      version: EndPointSliceModel.apiVersion,
    },
    isList: true,
    namespaced: true,
    namespace,
  });

  if (!loaded) {
    return <LoadingInline />;
  } else if (loaded && loadError) {
    return <Status status="Error" title={t('Error')} />;
  }
  const allEndpoints = data?.reduce((prev, next) => prev.concat(next?.endpoints), []);
  const receivingTraffic = allEndpoints?.some((endPoint) => endPoint?.targetRef?.name === podName);
  if (tooltipFlag) {
    return (
      loaded &&
      !loadError && (
        <div data-test="pod-traffic-status">
          <Tooltip
            position="top"
            content={receivingTraffic ? t('Receiving Traffic') : t('Not Receiving Traffic')}
          >
            {receivingTraffic ? <ConnectedIcon /> : <DisconnectedIcon />}
          </Tooltip>
        </div>
      )
    );
  }
  return loaded && !loadError && (receivingTraffic ? <ConnectedIcon /> : <DisconnectedIcon />);
};

export default PodTraffic;
