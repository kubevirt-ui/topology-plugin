import React, { SFC, useEffect } from 'react';
import classNames from 'classnames';

import ClusterServiceVersionModel from '@kubevirt-ui/kubevirt-api/console/models/ClusterServiceVersionModel';
import { k8sList, K8sResourceCommon, useSafetyFirst } from '@openshift-console/dynamic-plugin-sdk';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { ClusterServiceVersionKind } from '@topology-utils/types/k8s-types';

import ManagedByOperatorResourceLink from './components/ManagedByOperatorResourceLink';
import { findOwner, matchOwnerAndCSV } from './utils/utils';

type ManagedByLinkProps = {
  className?: string;
  obj: K8sResourceCommon;
};

const ManagedByOperatorLink: SFC<ManagedByLinkProps> = ({ obj, className }) => {
  const { t } = useTopologyTranslation();
  const [data, setData] = useSafetyFirst<ClusterServiceVersionKind[] | undefined>(undefined);
  const namespace = obj.metadata.namespace;
  useEffect(() => {
    if (!namespace) {
      return;
    }
    k8sList({
      model: ClusterServiceVersionModel,
      queryParams: {
        ns: namespace,
      },
    })
      .then((resData) => setData(resData as ClusterServiceVersionKind[]))
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error('Could not fetch CSVs', e);
      });
  }, [namespace, setData]);
  const owner = findOwner(obj, data);
  const csv = data && owner ? matchOwnerAndCSV(owner, data) : undefined;

  return owner && csv ? (
    <div className={classNames('co-m-pane__heading-owner', className)}>
      {t('Managed by')}{' '}
      <ManagedByOperatorResourceLink
        className="co-resource-item"
        namespace={namespace}
        csvName={csv.metadata.name}
        owner={owner}
      />
    </div>
  ) : null;
};

export default ManagedByOperatorLink;
