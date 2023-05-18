import React, { FC } from 'react';

import { Alert } from '@patternfly/react-core';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

type ErrorMessageProps = {
  message: any;
};

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  const { t } = useTopologyTranslation();
  return (
    <Alert
      isInline
      className="co-alert co-alert--scrollable"
      variant="danger"
      title={t('public~An error occurred')}
    >
      <div className="co-pre-line">{message}</div>
    </Alert>
  );
};

export default ErrorMessage;
