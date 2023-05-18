import React, { SFC, SyntheticEvent } from 'react';

import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import CloseButton from '../../../__tests__/CloseButton/CloseButton';

export type ModalTitleProps = {
  className?: string;
  close?: (e: SyntheticEvent<any, Event>) => void;
};

const ModalTitle: SFC<ModalTitleProps> = ({ children, className = 'modal-header', close }) => (
  <div className={className}>
    <TextContent>
      <Text component={TextVariants.h1} data-test-id="modal-title">
        {children}
        {close && (
          <CloseButton
            onClick={(e) => {
              e.stopPropagation();
              close(e);
            }}
            additionalClassName="co-close-button--float-right"
          />
        )}
      </Text>
    </TextContent>
  </div>
);

export default ModalTitle;
