import { FC, useContext, useEffect, useRef } from 'react';

import { useDeepCompareMemoize } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useDeepCompareMemoize';

import { TopologyDataModelFactory } from '../extensions/topology';

import { ExtensibleModel, ModelContext, ModelExtensionContext } from './ModelContext';

interface DataModelExtensionProps {
  dataModelFactory: TopologyDataModelFactory['properties'];
}

const DataModelExtension: FC<DataModelExtensionProps> = ({ dataModelFactory }) => {
  const dataModelContext = useContext<ExtensibleModel>(ModelContext);
  const { id, priority, resources } = dataModelFactory;
  const workloadKeys = useDeepCompareMemoize(dataModelFactory.workloadKeys);
  const extensionContext = useRef<ModelExtensionContext>({
    priority,
    workloadKeys,
    resources,
  });

  useEffect(() => {
    const storedContext = dataModelContext.getExtension(id);
    if (!storedContext) {
      extensionContext.current = {
        priority,
        workloadKeys,
        resources,
      };
      dataModelContext.updateExtension(id, extensionContext.current);

      const { getDataModel, isResourceDepicted, getDataModelReconciler } = dataModelFactory;
      if (getDataModel) {
        getDataModel()
          .then((getter) => {
            extensionContext.current.dataModelGetter = getter;
            dataModelContext.updateExtension(id, extensionContext.current);
          })
          .catch(() => {
            extensionContext.current.dataModelGetter = () => Promise.resolve({});
            dataModelContext.updateExtension(id, extensionContext.current);
          });
      } else {
        extensionContext.current.dataModelGetter = () => Promise.resolve({});
        dataModelContext.updateExtension(id, extensionContext.current);
      }

      if (isResourceDepicted) {
        isResourceDepicted()
          .then((depicter) => {
            extensionContext.current.dataModelDepicter = depicter;
            dataModelContext.updateExtension(id, extensionContext.current);
          })
          .catch(() => {
            extensionContext.current.dataModelDepicter = () => false;
            dataModelContext.updateExtension(id, extensionContext.current);
          });
      } else {
        extensionContext.current.dataModelDepicter = () => false;
        dataModelContext.updateExtension(id, extensionContext.current);
      }

      if (getDataModelReconciler) {
        getDataModelReconciler()
          .then((reconciler) => {
            extensionContext.current.dataModelReconciler = reconciler;
            dataModelContext.updateExtension(id, extensionContext.current);
          })
          .catch(() => {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            extensionContext.current.dataModelReconciler = () => {};
            dataModelContext.updateExtension(id, extensionContext.current);
          });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        extensionContext.current.dataModelReconciler = () => {};
        dataModelContext.updateExtension(id, extensionContext.current);
      }
    }
  }, [dataModelContext, dataModelFactory, id, priority, resources, workloadKeys]);

  return null;
};

export default DataModelExtension;
