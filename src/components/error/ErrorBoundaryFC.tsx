import React, {ComponentType, FC, useEffect, useState} from 'react';

import { ErrorBoundaryFallbackProps } from '@openshift-console/dynamic-plugin-sdk';
import {useHistory} from "react-router-dom";

type ErrorBoundaryProps = {
  FallbackComponent?: ComponentType<ErrorBoundaryFallbackProps>;
};

/** Needed for tests -- should not be imported by application logic */
export type ErrorBoundaryState = {
  hasError: boolean;
  error: { message: string; stack: string; name: string };
  errorInfo: { componentStack: string };
};

const DefaultFallback: FC = () => <div />;

type Error = { message: string, stack: string, name: string };
type ErrorInfo = { componentStack: string };

const defaultErrorValue: Error = {
  message: '',
  stack: '',
  name: '',
};

const defaultErrorInfoValue: ErrorInfo = {
  componentStack: '',
};

const ErrorBoundary: FC<ErrorBoundaryProps> = ({FallbackComponent}) =>  {
  const history = useHistory();
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<Error>(defaultErrorValue);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>(defaultErrorInfoValue);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let unlisten: () => void = () => {};

  useEffect(() => {
    unlisten = history.listen(() => {
      // reset state to default when location changes
      setHasError(false);
      setError(defaultErrorValue);
      setErrorInfo(defaultErrorInfoValue);
    })
  }, [unlisten])

  componentWillUnmount() {
    this.unlisten();
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
    // Log the error so something shows up in the JS console when `DefaultFallback` is used.
    // eslint-disable-next-line no-console
    console.error('Caught error in a child component:', error, errorInfo);
  }

    const { hasError, error, errorInfo } = this.state;
    const FallbackComponent = this.props.FallbackComponent || DefaultFallback;
    return hasError ? (
      <FallbackComponent
        title={error.name}
        componentStack={errorInfo.componentStack}
        errorMessage={error.message}
        stack={error.stack}
      />
    ) : (
      <>{props.children}</>
    );
}

export default ErrorBoundary;
