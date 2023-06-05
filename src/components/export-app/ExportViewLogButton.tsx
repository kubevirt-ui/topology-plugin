import React, { FC, MouseEvent, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { JobModel, PodModel } from '@kubevirt-ui/kubevirt-api/console';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { Button, Tooltip } from '@patternfly/react-core';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import { resourcePath } from '../../../cdi-upload-provider/utils/utils';
import { EXPORT_JOB_PREFIX } from '../../const';
import { isModifiedEvent } from '../../utils/common-utils';
import { JobKind } from '../../utils/hooks/useBuildsConfigWatcher/utils/types';
import { PodKind } from '../../utils/types/podTypes';

interface ExportViewLogButtonProps {
  name: string;
  namespace: string;
  onViewLog?: () => void;
}

const ExportViewLogButton: FC<ExportViewLogButtonProps> = ({ name, namespace, onViewLog }) => {
  const history = useHistory();
  const { t } = useTopologyTranslation();
  const [job, jobLoaded] = useK8sWatchResource<JobKind>({
    kind: JobModel.kind,
    name: EXPORT_JOB_PREFIX + name,
    namespace,
    isList: false,
  });

  const podResource = useMemo(
    () =>
      jobLoaded && job?.metadata
        ? {
            kind: PodModel.kind,
            isList: false,
            namespace: job.metadata.namespace,
            selector: job.spec.selector,
          }
        : null,
    [job, jobLoaded],
  );

  const [podData, podLoaded] = useK8sWatchResource<PodKind>(podResource);

  const path =
    podLoaded &&
    podData?.kind === PodModel?.kind &&
    podData?.metadata &&
    `${resourcePath(PodModel, podData?.metadata.name, podData?.metadata.namespace)}/logs`;

  const viewLog = (e: MouseEvent<HTMLButtonElement>) => {
    if (isModifiedEvent(e)) {
      return;
    }
    e.preventDefault();
    history.push(path);
    onViewLog?.();
  };

  const linkedButton = (
    <Button
      component="a"
      variant="link"
      data-test="export-view-log-btn"
      href={path}
      onClick={viewLog}
    >
      {t('View Logs')}
    </Button>
  );
  const disabledButton = (
    <Tooltip content={t('Logs not available yet')}>
      <Button component="a" variant="link" data-test="export-view-log-btn" isAriaDisabled>
        {t('View Logs')}
      </Button>
    </Tooltip>
  );

  return path ? linkedButton : disabledButton;
};

export default ExportViewLogButton;
