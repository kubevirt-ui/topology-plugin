import React, { ComponentType } from 'react';

import ErrorBoundary from './ErrorBoundary';

type WithFallback = <P = Record<string, unknown>>(
  Component: ComponentType<P>,
  FallbackComponent?: ComponentType<any>,
) => ComponentType<P>;

const withFallback: WithFallback = (WrappedComponent, FallbackComponent) => {
  const Component = (props) => (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
  Component.displayName = `withFallback(${WrappedComponent.displayName || WrappedComponent.name})`;
  return Component;
};

export default withFallback;
