import React, { FC } from 'react';
import { Trans } from 'react-i18next';

import { useFlag } from '@openshift-console/dynamic-plugin-sdk';
import { Button } from '@patternfly/react-core';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { FLAGS } from '@topology-utils/types/commonTypes';

type CreateProjectButtonProps = {
  openProjectModal: () => void;
};

const CreateProjectButton: FC<CreateProjectButtonProps> = ({ openProjectModal }) => {
  const { t } = useTopologyTranslation();
  const canCreateProject = useFlag(FLAGS.CAN_CREATE_PROJECT);
  return (
    canCreateProject && (
      <Trans t={t} ns="plugin__topology-plugin">
        {' or '}
        <Button isInline variant="link" onClick={openProjectModal}>
          create a Project
        </Button>
      </Trans>
    )
  );
};

export default CreateProjectButton;
