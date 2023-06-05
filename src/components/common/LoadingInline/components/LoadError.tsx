import React, { FC } from 'react';
import { Trans } from 'react-i18next';

import { Button } from '@patternfly/react-core';
import { isString } from '@topology-utils/common-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import Box from './Box';

type LoadErrorProps = {
  label: string;
  className?: string;
  message?: string;
  canRetry?: boolean;
};

const LoadError: FC<LoadErrorProps> = ({ label, className, message, canRetry = true }) => {
  const { t } = useTopologyTranslation();
  return (
    <Box className={className}>
      <div className="pf-u-text-align-center cos-error-title">
        {isString(message)
          ? t('Error Loading {{label}}: {{message}}', {
              label,
              message,
            })
          : t('Error Loading {{label}}', { label })}
      </div>
      {canRetry && (
        <div className="pf-u-text-align-center">
          <Trans ns="public">
            Please{' '}
            <Button
              type="button"
              onClick={window.location.reload.bind(window.location)}
              variant="link"
              isInline
            >
              try again
            </Button>
            .
          </Trans>
        </div>
      )}
    </Box>
  );
};

export default LoadError;
