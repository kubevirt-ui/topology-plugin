import React, { FC } from 'react';

import { useAccessReview, useFlag } from '@openshift-console/dynamic-plugin-sdk';
import { Button, ToolbarItem } from '@patternfly/react-core';
import useToast from '@topology-utils/hooks/useToast';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import { ALLOW_EXPORT_APP, EXPORT_CR_NAME } from '../../const';
import { ExportModel } from '../../models';
import useIsMobile from '../page/TopologyPageToolbar/hooks/useIsMobile/useIsMobile';

import { handleExportApplication } from './ExportApplicationModal';

type ExportApplicationProps = {
  namespace: string;
  isDisabled: boolean;
};

const ExportApplication: FC<ExportApplicationProps> = ({ namespace, isDisabled }) => {
  const { t } = useTopologyTranslation();
  const isMobile = useIsMobile();
  const toast = useToast();
  const isExportAppAllowed = useFlag(ALLOW_EXPORT_APP);
  const canExportApp = useAccessReview({
    group: ExportModel.apiGroup,
    resource: ExportModel.plural,
    verb: 'create',
    namespace,
  });

  const showExportAppBtn = canExportApp && isExportAppAllowed && !isMobile;
  const name = EXPORT_CR_NAME;

  return showExportAppBtn ? (
    <ToolbarItem>
      <Button
        variant="secondary"
        data-test="export-app-btn"
        aria-label={t('Export application')}
        isDisabled={isDisabled}
        onClick={() => handleExportApplication(name, namespace, toast)}
      >
        {t('Export application')}
      </Button>
    </ToolbarItem>
  ) : null;
};

export default ExportApplication;
