import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react';

import { modelToRef } from '@kubevirt-ui/kubevirt-api/console';
import {
  ExtensionK8sGroupKindModel,
  isTopologyDataModelFactory as isDynamicTopologyDataModelFactory,
  TopologyDataModelFactory as DynamicTopologyDataModelFactory,
  WatchK8sResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { LoadedExtension } from '@openshift-console/dynamic-plugin-sdk/lib/types';
import { referenceForExtensionModel } from '@topology-utils/k8s-utils';
import { K8sWatchResourceGeneric } from '@topology-utils/types/k8s-types';

import { isTopologyDataModelFactory, TopologyDataModelFactory } from '../extensions';

import DataModelExtension from './DataModelExtension';
import { ExtensibleModel, ModelContext } from './ModelContext';
import TopologyDataRetriever from './TopologyDataRetriever';

interface DataModelProviderProps {
  namespace: string;
  children?: ReactNode;
}

const flattenResource = (
  namespace: string,
  model?: ExtensionK8sGroupKindModel,
  opts = {} as Partial<WatchK8sResource>,
) => {
  if (!model) {
    return { namespace, ...opts };
  }

  if (model.version) {
    const extensionReference = referenceForExtensionModel(model); // requires model.version
    return { namespace, kind: extensionReference, ...opts };
  }

  // If can't find reference for an extention model, fall back to internal reference
  // TODO Find out if we can use getK8sModel here instead
  const internalModel = modelForGroupKind(model.group, model.kind); // Return null for CRDs
  const internalReference = internalModel && modelToRef(internalModel);
  return { namespace, kind: internalReference, ...opts };
};

export const getNamespacedDynamicModelFactories = (
  factories: LoadedExtension<DynamicTopologyDataModelFactory>[],
) =>
  factories.map(({ properties, ...ext }) => {
    return {
      ...ext,
      properties: {
        ...properties,
        resources: (namespace: string) =>
          Object.assign(
            {},
            ...Object.entries(properties.resources).map(([k, v]) => {
              const resource = v as K8sWatchResourceGeneric;
              return {
                [k]: flattenResource(namespace, resource?.model, resource?.opts),
              };
            }),
          ),
      },
    };
  });

const DataModelProvider: FC<DataModelProviderProps> = ({ namespace, children }) => {
  const [model, setModel] = useState<ExtensibleModel>(new ExtensibleModel(namespace));

  useEffect(() => {
    setModel(new ExtensibleModel(namespace));
  }, [namespace]);

  const modelFactories = useExtensions<TopologyDataModelFactory>(isTopologyDataModelFactory);
  const dynamicModelFactories = useExtensions<DynamicTopologyDataModelFactory>(
    isDynamicTopologyDataModelFactory,
  );

  const namespacedDynamicFactories = useMemo(
    () => getNamespacedDynamicModelFactories(dynamicModelFactories),
    [dynamicModelFactories],
  );

  return (
    <ModelContext.Provider value={model}>
      {namespace && (
        <>
          {[...namespacedDynamicFactories, ...modelFactories].map((factory) => (
            <DataModelExtension key={factory.properties.id} dataModelFactory={factory.properties} />
          ))}
        </>
      )}
      {namespace && <TopologyDataRetriever />}
      {children}
    </ModelContext.Provider>
  );
};

export default DataModelProvider;
