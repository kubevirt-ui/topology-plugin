import React, { FC, ReactElement } from 'react';

import { AlertSeverity } from '@openshift-console/dynamic-plugin-sdk';
import { ExclamationCircleIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';

interface AlertSeverityIconProps {
  severityAlertType: AlertSeverity;
  fontSize?: number;
}

const AlertSeverityIcon: FC<AlertSeverityIconProps> = ({
  severityAlertType,
  fontSize,
}): ReactElement => {
  switch (severityAlertType) {
    case AlertSeverity.Critical:
      return (
        <ExclamationCircleIcon
          style={{
            fontSize,
            fill: 'var(--pf-global--danger-color--100)',
          }}
        />
      );
    case AlertSeverity.Warning:
    default:
      return (
        <ExclamationTriangleIcon
          style={{
            fontSize,
            fill: 'var(--pf-global--warning-color--100)',
          }}
        />
      );
  }
};

export default AlertSeverityIcon;
