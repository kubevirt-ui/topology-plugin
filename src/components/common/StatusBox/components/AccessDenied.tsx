import React, { FC } from 'react';

import { Alert } from '@patternfly/react-core';
import { isString } from '@topology-utils/common-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import * as restrictedSignImg from '../../../../../images/restricted-sign.svg';
import Box from '../../LoadingInline/components/Box';
import MsgBox from '../../LoadingInline/components/MsgBox';

type AccessDeniedProps = {
  message?: string;
};

const AccessDenied: FC<AccessDeniedProps> = ({ message }) => {
  const { t } = useTopologyTranslation();
  return (
    <div>
      <Box className="pf-u-text-align-center">
        <img className="cos-status-box__access-denied-icon" src={restrictedSignImg} />
        <MsgBox
          title={t('Restricted Access')}
          detail={t("You don't have access to this section due to cluster policy.")}
        />
      </Box>
      {isString(message) && (
        <Alert isInline className="co-alert" variant="danger" title={t('Error details')}>
          {message}
        </Alert>
      )}
    </div>
  );
};

export default AccessDenied;
