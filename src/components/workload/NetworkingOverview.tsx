import React, { FC } from 'react';

import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { LongArrowAltRightIcon } from '@patternfly/react-icons';
import useRoutesWatcher from '@topology-utils/hooks/useRoutesWatcher';
import useServicesWatcher from '@topology-utils/hooks/useServicesWatcher';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';
import { RouteKind } from '@topology-utils/types/knativeTypes';

import RouteLocation from '../common/RouteLocation/RouteLocation';

import SidebarSectionHeading from './JobOverview/components/SidebarSectionHeading';

const ServicePortList: FC<ServicePortListProps> = ({ service }) => {
  const ports = service.spec?.ports ?? [];
  const { t } = useTopologyTranslation();
  return (
    <ul className="port-list">
      {ports.map(({ name, port, protocol, targetPort }) => (
        <li key={name || `${protocol}/${port}`}>
          <span className="text-muted">{t('Service port:')}</span> {name || `${protocol}/${port}`}
          &nbsp;
          <LongArrowAltRightIcon />
          &nbsp;
          <span className="text-muted">{t('Pod port:')}</span> {targetPort}
        </li>
      ))}
    </ul>
  );
};

const ServicesOverviewListItem: FC<ServiceOverviewListItemProps> = ({ service }) => {
  const { name, namespace } = service.metadata;
  return (
    <li className="list-group-item">
      <ResourceLink kind="Service" name={name} namespace={namespace} />
      <ServicePortList service={service} />
    </li>
  );
};

const ServicesOverviewList: FC<ServiceOverviewListProps> = ({ services }) => (
  <ul className="list-group">
    {services?.map((service) => (
      <ServicesOverviewListItem key={service.metadata.uid} service={service} />
    ))}
  </ul>
);

const RoutesOverviewListItem: FC<RoutesOverviewListItemProps> = ({ route }) => {
  const { name, namespace } = route.metadata;
  const { t } = useTopologyTranslation();
  return (
    <li className="list-group-item">
      <ResourceLink kind="Route" name={name} namespace={namespace} />
      <span className="text-muted">{t('Location:')}</span>
      <RouteLocation obj={route} />
    </li>
  );
};

const RoutesOverviewList: FC<RoutesOverviewListProps> = ({ routes }) => (
  <ul className="list-group">
    {routes?.map((route) => (
      <RoutesOverviewListItem key={route.metadata.uid} route={route} />
    ))}
  </ul>
);

export const NetworkingOverview: FC<NetworkingOverviewProps> = ({ obj }) => {
  const { t } = useTopologyTranslation();
  const serviceResources = useServicesWatcher(obj);
  const services =
    serviceResources.loaded && !serviceResources.loadError ? serviceResources.services : [];
  const routeResources = useRoutesWatcher(obj);
  const routes = routeResources.loaded && !routeResources.loadError ? routeResources.routes : [];
  return (
    <>
      <SidebarSectionHeading text={t('Services')} />
      {!(services?.length > 0) ? (
        <span className="text-muted">{t('No Services found for this resource.')}</span>
      ) : (
        <ServicesOverviewList services={services} />
      )}

      <SidebarSectionHeading text={t('Routes')} />
      {!(routes?.length > 0) ? (
        <span className="text-muted">{t('No Routes found for this resource.')}</span>
      ) : (
        <RoutesOverviewList routes={routes} />
      )}
    </>
  );
};

type RoutesOverviewListProps = {
  routes: RouteKind[];
};

type RoutesOverviewListItemProps = {
  route: RouteKind;
};

type NetworkingOverviewProps = {
  obj: K8sResourceKind;
};

type ServicePortListProps = {
  service: K8sResourceKind;
};

type ServiceOverviewListProps = {
  services: K8sResourceKind[];
};

type ServiceOverviewListItemProps = {
  service: K8sResourceKind;
};
