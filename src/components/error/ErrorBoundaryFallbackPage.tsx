import React, { FC } from 'react';

import { ErrorBoundaryFallbackProps } from '@openshift-console/dynamic-plugin-sdk';
import { Text, TextVariants } from '@patternfly/react-core';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import ErrorDetailsBlock from './ErrorDetailsBlock';
import ExpandCollapse from './ExpandCollapse';

/**
 * Standard fallback catch -- expected to take up the whole page.
 */
const ErrorBoundaryFallbackPage: FC<ErrorBoundaryFallbackProps> = (props) => {
  const { t } = useTopologyTranslation();
  return (
    <div className="co-m-pane__body">
      <Text component={TextVariants.h1} className="co-m-pane__heading co-m-pane__heading--center">
        {t('Oh no! Something went wrong.')}
      </Text>
      <ExpandCollapse textCollapsed={t('Show details')} textExpanded={t('Hide details')}>
        <ErrorDetailsBlock {...props} />
      </ExpandCollapse>
    </div>
  );
};

export default ErrorBoundaryFallbackPage;
