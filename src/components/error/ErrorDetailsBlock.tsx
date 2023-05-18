import React, { FC } from 'react';

import { ErrorBoundaryFallbackProps } from '@openshift-console/dynamic-plugin-sdk';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import CopyToClipboard from '../common/CopyToClipboard';

const ErrorDetailsBlock: FC<ErrorBoundaryFallbackProps> = (props) => {
  const { t } = useTopologyTranslation();
  return (
    <>
      <h3 className="co-section-heading-tertiary">{props.title}</h3>
      <div className="form-group">
        <label htmlFor="description">{t('Description:')}</label>
        <p>{props.errorMessage}</p>
      </div>
      <div className="form-group">
        <label htmlFor="componentTrace">{t('Component trace:')}</label>
        <div className="co-copy-to-clipboard__stacktrace-width-height">
          <CopyToClipboard value={props.componentStack.trim()} />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="stackTrace">{t('Stack trace:')}</label>
        <div className="co-copy-to-clipboard__stacktrace-width-height">
          <CopyToClipboard value={props.stack.trim()} />
        </div>
      </div>
    </>
  );
};

export default ErrorDetailsBlock;
