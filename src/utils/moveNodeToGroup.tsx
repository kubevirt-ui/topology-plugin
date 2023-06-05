import React from 'react';
import { Trans } from 'react-i18next';

import { Node } from '@patternfly/react-topology';
import { t } from '@topology-utils/hooks/useTopologyTranslation';

import confirmModal from '../components/modals/ConfirmModal';
import errorModal from '../components/modals/ErrorModal';

import { updateTopologyResourceApplication } from './topology-utils';

export const moveNodeToGroup = (node: Node, targetGroup: Node): Promise<void> => {
  const sourceGroup = node.getParent() !== node.getGraph() ? (node.getParent() as Node) : undefined;
  if (sourceGroup === targetGroup) {
    return Promise.reject();
  }

  if (sourceGroup) {
    const titleKey = targetGroup
      ? t('Move component node')
      : t('Remove component node from application');
    const nodeLabel = node.getLabel();
    const sourceLabel = sourceGroup.getLabel();
    const targetLabel = targetGroup?.getLabel();
    const message = targetGroup ? (
      <Trans ns="plugin__topology-plugin">
        Are you sure you want to move <strong>{{ nodeLabel }}</strong> from {{ sourceLabel }} to{' '}
        {{ targetLabel }}?
      </Trans>
    ) : (
      <Trans ns="plugin__topology-plugin">
        Are you sure you want to remove <strong>{{ nodeLabel }}</strong> from {{ sourceLabel }}?
      </Trans>
    );
    const btnTextKey = targetGroup ? t('Move') : t('Remove');

    return new Promise((resolve, reject) => {
      confirmModal({
        titleKey,
        message,
        btnTextKey,
        close: () => {
          reject();
        },
        cancel: () => {
          reject();
        },
        executeFn: () => {
          return updateTopologyResourceApplication(
            node,
            targetGroup ? targetGroup.getLabel() : null,
          )
            .then(resolve)
            .catch((err) => {
              const error = err.message;
              errorModal({ error });
              reject(err);
            });
        },
      });
    });
  }

  return updateTopologyResourceApplication(node, targetGroup.getLabel()).catch((err) => {
    const error = err.message;
    errorModal({ error });
  });
};
