import React, { ComponentType, FC, useState } from 'react';

import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { Diff } from '@topology-utils/types/commonTypes';

export type HandlePromiseProps = {
  handlePromise: <T>(
    promise: Promise<T>,
    onFulfill?: (res) => void,
    onError?: (errorMsg: string) => void,
  ) => void;
  inProgress: boolean;
  errorMessage: string;
};

export type WithHandlePromise = <P extends HandlePromiseProps>(
  C: ComponentType<P>,
) => FC<Diff<P, HandlePromiseProps>>;

const withHandlePromise: WithHandlePromise = (Component) => (props) => {
  const [inProgress, setInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { t } = useTopologyTranslation();

  const handlePromise = (promise, onFulfill, onError) => {
    setInProgress(true);
    promise.then(
      (res) => {
        setInProgress(false);
        setErrorMessage('');
        onFulfill && onFulfill(res);
      },
      (error) => {
        const errorMsg = error.message || t('An error occurred. Please try again.');
        setInProgress(false);
        setErrorMessage(errorMsg);
        onError
          ? onError(errorMsg)
          : // eslint-disable-next-line no-console
            console.error(
              `handlePromise failed in component ${Component.displayName || Component.name}:`,
              error,
            );
      },
    );
  };

  return (
    <Component
      {...(props as any)}
      handlePromise={handlePromise}
      inProgress={inProgress}
      errorMessage={errorMessage}
    />
  );
};

export default withHandlePromise;
