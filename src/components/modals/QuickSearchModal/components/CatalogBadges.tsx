import React, { FC } from 'react';

import { CatalogItemBadge } from '@openshift-console/dynamic-plugin-sdk';
import { Label } from '@patternfly/react-core';

type CatalogBadgesProps = {
  badges: CatalogItemBadge[];
};

const CatalogBadges: FC<CatalogBadgesProps> = ({ badges }) => (
  <div className="odc-catalog-badges">
    {badges?.map((badge, index) => (
      <Label
        key={`${badge.text}-${index}`}
        className="odc-catalog-badges__label"
        color={badge.color}
        icon={badge.icon}
        variant={badge.variant}
      >
        {badge.text}
      </Label>
    ))}
  </div>
);

export default CatalogBadges;
