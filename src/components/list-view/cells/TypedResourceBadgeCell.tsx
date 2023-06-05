import React, { FC, ReactNode } from 'react';

import { ResourceIcon } from '@openshift-console/dynamic-plugin-sdk';
import { observer } from '@patternfly/react-topology';
import { isValidUrl } from '@topology-utils/common-utils';
import { getImageForIconClass } from '@topology-utils/logos';

interface TypedResourceBadgeCellProps {
  kind: string;
  imageClass?: string;
  typeIconClass?: string;
  typeIcon?: ReactNode;
}

const TypedResourceBadgeCell: FC<TypedResourceBadgeCellProps> = ({
  typeIconClass,
  typeIcon,
  imageClass,
  kind,
}) => {
  let itemIcon: ReactNode;
  let iconType: ReactNode;
  if (imageClass) {
    itemIcon = (
      <image
        className="odc-topology-list-view__resource-icon co-m-resource-icon--md"
        xlinkHref={isValidUrl(imageClass) ? imageClass : getImageForIconClass(imageClass)}
      />
    );
  } else {
    itemIcon = (
      <ResourceIcon
        className="odc-topology-list-view__resource-icon co-m-resource-icon--md"
        kind={kind}
      />
    );
  }
  if (typeIconClass) {
    iconType = (
      <span className="odc-topology-list-view__type-icon-bg">
        <img
          className="odc-topology-list-view__type-icon"
          alt={kind}
          src={isValidUrl(typeIconClass) ? typeIconClass : getImageForIconClass(typeIconClass)}
        />
      </span>
    );
  } else if (typeIcon) {
    iconType = (
      <span className="odc-topology-list-view__type-icon-bg">
        <foreignObject className="odc-topology-list-view__type-icon">{typeIcon}</foreignObject>
      </span>
    );
  } else {
    iconType = null;
  }

  return (
    <span className="odc-topology-list-view__resource-icon__container">
      {itemIcon}
      {iconType}
    </span>
  );
};

export default observer(TypedResourceBadgeCell);
