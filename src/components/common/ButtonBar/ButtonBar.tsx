import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';

import { AlertGroup } from '@patternfly/react-core';

import LoadingInline from '../LoadingInline/LoadingInline';

import ErrorMessage from './components/ErrorMessage';
import InfoMessage from './components/InfoMessage';
import SuccessMessage from './components/SuccessMessage';
import { injectDisabled } from './utils/utils';

type ButtonBarProps = {
  children: ReactNode;
  successMessage?: string;
  errorMessage?: ReactNode;
  infoMessage?: string;
  inProgress?: boolean;
  className?: string;
};

const ButtonBar: FC<ButtonBarProps> = ({
  children,
  className,
  errorMessage,
  infoMessage,
  successMessage,
  inProgress,
}) => {
  return (
    <div className={classNames(className, 'co-m-btn-bar')}>
      <AlertGroup
        isLiveRegion
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions text"
      >
        {successMessage && <SuccessMessage message={successMessage} />}
        {errorMessage && <ErrorMessage message={errorMessage} />}
        {injectDisabled(children, inProgress)}
        {inProgress && <LoadingInline />}
        {infoMessage && <InfoMessage message={infoMessage} />}
      </AlertGroup>
    </div>
  );
};

export default ButtonBar;
