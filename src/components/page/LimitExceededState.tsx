import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Title,
} from '@patternfly/react-core';
import { TopologyIcon } from '@patternfly/react-icons';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

type LimitExceededStateProps = {
  onShowTopologyAnyway: () => void;
};

export const LimitExceededState: FC<LimitExceededStateProps> = ({ onShowTopologyAnyway }) => {
  const { t } = useTopologyTranslation();
  return (
    <EmptyState>
      <EmptyStateIcon variant="container" component={TopologyIcon} />
      <Title headingLevel="h4" size="lg">
        {t(`Loading is taking longer than expected`)}
      </Title>
      <EmptyStateBody>
        {t(
          `We noticed that it is taking a long time to visualize your application Topology. You can use Search to find specific resources or click Continue to keep waiting.`,
        )}
      </EmptyStateBody>
      <Button variant="primary" component={(props) => <Link {...props} to="/search-page" />}>
        {t('Go to Search')}
      </Button>
      <EmptyStateSecondaryActions>
        <Button variant="link" onClick={onShowTopologyAnyway}>
          {t('Continue')}
        </Button>
      </EmptyStateSecondaryActions>
    </EmptyState>
  );
};
