import React, { FC } from 'react';

import { Button, Tooltip } from '@patternfly/react-core';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import QuickSearchIcon from '../modals/QuickSearchModal/components/QuickSearchIcon';

import './TopologyQuickSearchButton.scss';

interface QuickSearchButtonProps {
  onClick: () => void;
}

const TopologyQuickSearchButton: FC<QuickSearchButtonProps> = ({ onClick }) => {
  const { t } = useTopologyTranslation();

  return (
    <Tooltip position="right" content={t('Add to Project')}>
      <Button
        className="odc-topology-quick-search-button"
        data-test="quick-search"
        variant="plain"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        aria-label={t('Quick search button')}
      >
        <QuickSearchIcon />
      </Button>
    </Tooltip>
  );
};

export default TopologyQuickSearchButton;
