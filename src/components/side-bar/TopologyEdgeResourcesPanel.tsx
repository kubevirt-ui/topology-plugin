import React, { FC } from 'react';

import { ConsoleLinkModel, SecretModel } from '@kubevirt-ui/kubevirt-api/console';
import {
  getGroupVersionKindForModel,
  getGroupVersionKindForResource,
  ResourceLink,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Edge } from '@patternfly/react-topology';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import { TYPE_TRAFFIC_CONNECTOR } from '../../const';
import { getNamespaceDashboardKialiLink, getResource } from '../../utils';
import ExternalLink from '../common/ExternalLink';
import SidebarSectionHeading from '../workload/JobOverview/components/SidebarSectionHeading';

type TopologyEdgeResourcesPanelProps = {
  edge: Edge;
};

const TopologyEdgeResourcesPanel: FC<TopologyEdgeResourcesPanelProps> = ({ edge }) => {
  const { t } = useTopologyTranslation();
  const [consoleLinks] = useK8sWatchResource<K8sResourceKind[]>({
    isList: true,
    groupVersionKind: getGroupVersionKindForModel(ConsoleLinkModel),
    optional: true,
  });
  const source = getResource(edge.getSource());
  const target = getResource(edge.getTarget());
  const data = edge.getData();
  const resources = [source, target];
  const {
    metadata: { namespace },
  } = resources[1];

  return (
    <div className="overview__sidebar-pane-body">
      <SidebarSectionHeading text={t('Connections')} />
      <ul className="list-group">
        {resources?.map((resource) => {
          if (!resource) {
            return null;
          }
          const {
            metadata: { name, uid },
            spec,
          } = resource;
          const sinkUri = spec?.sinkUri;

          return (
            <li className="list-group-item  container-fluid" key={uid}>
              {!sinkUri ? (
                <ResourceLink
                  groupVersionKind={getGroupVersionKindForResource(resource)}
                  name={name}
                  namespace={namespace}
                  dataTest={`resource-link-${name}`}
                />
              ) : (
                <ExternalLink
                  href={sinkUri}
                  additionalClassName="co-external-link--block"
                  text={sinkUri}
                  dataTestID={`sink-uri-${sinkUri}`}
                />
              )}
            </li>
          );
        })}
      </ul>
      {data?.sbr?.status.secret && (
        <>
          <SidebarSectionHeading text={t('Secret')} />
          <ul className="list-group">
            <li className="list-group-item  container-fluid" key={data.sbr.status.secret}>
              <ResourceLink
                groupVersionKind={getGroupVersionKindForModel(SecretModel)}
                name={data.sbr.status.secret}
                namespace={data.sbr.metadata.namespace}
                dataTest={`secret-resource-link-${data.sbr.status.secret}`}
              />
            </li>
          </ul>
        </>
      )}
      {edge.getType() === TYPE_TRAFFIC_CONNECTOR && (
        <>
          <SidebarSectionHeading text={t('Kiali link')} />
          <ExternalLink
            href={getNamespaceDashboardKialiLink(consoleLinks, namespace)}
            text={t('Kiali Graph view')}
            dataTestID="kiali-link"
          />
        </>
      )}
    </div>
  );
};

export default TopologyEdgeResourcesPanel;
