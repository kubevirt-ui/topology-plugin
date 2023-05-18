import React, { FC, memo } from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import { TopologyIcon } from '@patternfly/react-icons';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

type TopologyEmptyStateProps = {
  setIsQuickSearchOpen: (isOpen: boolean) => void;
};

const TopologyEmptyState: FC<TopologyEmptyStateProps> = ({ setIsQuickSearchOpen }) => {
  const { t } = useTopologyTranslation();

  return (
    <EmptyState
      className="odc-topology__empty-state"
      variant={EmptyStateVariant.full}
      data-test="no-resources-found"
    >
      <EmptyStateIcon variant="container" component={TopologyIcon} />
      <Title headingLevel="h3" size="lg">
        {t('No resources found')}
      </Title>
      <EmptyStateSecondaryActions>
        <Trans t={t} ns="plugin__topology-plugin">
          <Button
            isInline
            variant="link"
            data-test="start-building-your-application"
            onClick={(e) => {
              e.stopPropagation();
              setIsQuickSearchOpen(true);
            }}
          >
            Start building your application
          </Button>
          {' or visit the '}
          <Link to="/add" data-test="add-page">
            Add page
          </Link>
          {' for more details.'}
        </Trans>
      </EmptyStateSecondaryActions>
    </EmptyState>
  );
};

export default memo(TopologyEmptyState);
