import React from 'react';

import { Alert, AlertActionLink } from '@patternfly/react-core';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { togglePaused } from '@topology-utils/workload-pause-utils';

import errorModal from '../../modals/ErrorModal';

const WorkloadPausedAlert = ({ model, obj }) => {
  const { t } = useTopologyTranslation();
  return (
    <Alert
      isInline
      className="co-alert"
      variant="info"
      title={<>{t('public~{{ metadataName }} is paused', { metadataName: obj.metadata.name })}</>}
      actionLinks={
        <AlertActionLink
          onClick={() =>
            togglePaused(model, obj).catch((err) => errorModal({ error: err.message }))
          }
        >
          {obj.kind === 'MachineConfigPool'
            ? t('public~Resume updates')
            : t('public~Resume rollouts')}
        </AlertActionLink>
      }
    >
      {t('public~This will stop any new rollouts or triggers from running until resumed.')}
    </Alert>
  );
};

export default WorkloadPausedAlert;
