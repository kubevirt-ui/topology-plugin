import React, { FC, ReactNode } from 'react';

import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
import { Button, Popover } from '@patternfly/react-core';

type PodStatusPopoverProps = {
  bodyContent: string;
  headerContent?: string;
  footerContent?: ReactNode | string;
  status: string;
};

const PodStatusPopover: FC<PodStatusPopoverProps> = ({
  bodyContent,
  headerContent,
  footerContent,
  status,
}) => {
  return (
    <Popover headerContent={headerContent} bodyContent={bodyContent} footerContent={footerContent}>
      <Button variant="link" isInline data-test="popover-status-button">
        <Status status={status} />
      </Button>
    </Popover>
  );
};

export default PodStatusPopover;
