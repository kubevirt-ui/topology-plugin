import React, { FC } from 'react';
import classNames from 'classnames';

import { Button } from '@patternfly/react-core';
import { CloseIcon } from '@patternfly/react-icons';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import './CloseButton.scss';

type CloseButtonProps = {
  additionalClassName?: string;
  ariaLabel?: string;
  dataTestID?: string;
  onClick: (e: any) => void;
};

const CloseButton: FC<CloseButtonProps> = ({
  additionalClassName,
  ariaLabel,
  dataTestID,
  onClick,
}) => {
  const { t } = useTopologyTranslation();
  return (
    <Button
      aria-label={ariaLabel || t('Close')}
      className={classNames('co-close-button', additionalClassName)}
      data-test-id={dataTestID}
      onClick={onClick}
      variant="plain"
    >
      <CloseIcon />
    </Button>
  );
};

export default CloseButton;
