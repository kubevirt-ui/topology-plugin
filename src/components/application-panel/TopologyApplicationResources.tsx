import React, { FC } from 'react';

import { labelKeyForNodeKind } from '../../utils/common-utils';
import { OdcNodeModel } from '../../utils/types/topology-types';

import ApplicationGroupResource from './ApplicationGroupResource';

import './TopologyApplicationResources.scss';

type TopologyApplicationResourcesProps = {
  resources: OdcNodeModel[];
  group: string;
};

const TopologyApplicationResources: FC<TopologyApplicationResourcesProps> = ({
  resources,
  group,
}) => {
  const resourcesData = resources.reduce((acc, { resource }) => {
    if (resource?.kind) {
      acc[resource.kind] = [...(acc[resource.kind] ? acc[resource.kind] : []), resource];
    }
    return acc;
  }, {});

  return (
    <>
      {Object.keys(resourcesData)?.map((key) => (
        <ApplicationGroupResource
          key={`${group}-${key}`}
          title={labelKeyForNodeKind(key)}
          resourcesData={resourcesData[key]}
          group={group}
        />
      ))}
    </>
  );
};

export default TopologyApplicationResources;
