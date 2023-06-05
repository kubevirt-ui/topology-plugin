import React from 'react';
import { Trans } from 'react-i18next';

import { YellowExclamationTriangleIcon } from '@openshift-console/dynamic-plugin-sdk';
import { Edge } from '@patternfly/react-topology';
import { t } from '@topology-utils/hooks/useTopologyTranslation';

import confirmModal from '../components/modals/ConfirmModal';
import errorModal from '../components/modals/ErrorModal';

import { removeTopologyResourceConnection } from './topology-utils';

export const removeConnection = (edge: Edge): Promise<any> => {
  const messageKey = t(
    'Deleting the visual connector removes the `connects-to` annotation from the resources. Are you sure you want to delete the visual connector?',
  );
  return confirmModal({
    title: (
      <>
        <YellowExclamationTriangleIcon className="co-icon-space-r" />{' '}
        <Trans ns="plugin__topology-plugin">Delete Connector?</Trans>
      </>
    ),
    messageKey,
    btnTextKey: t('Delete'),
    submitDanger: true,
    executeFn: () => {
      return removeTopologyResourceConnection(edge).catch((err) => {
        err && errorModal({ error: err.message });
      });
    },
  });
};
