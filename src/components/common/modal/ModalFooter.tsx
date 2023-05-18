import React from 'react';

import ButtonBar from '../ButtonBar/ButtonBar';

export type ModalFooterProps = {
  message?: string;
  errorMessage?: React.ReactNode;
  inProgress: boolean;
  className?: string;
};

const ModalFooter: React.SFC<ModalFooterProps> = ({
  message,
  errorMessage,
  inProgress,
  children,
  className = 'modal-footer',
}) => {
  return (
    <ButtonBar
      className={className}
      errorMessage={errorMessage}
      infoMessage={message}
      inProgress={inProgress}
    >
      {children}
    </ButtonBar>
  );
};

export default ModalFooter;
