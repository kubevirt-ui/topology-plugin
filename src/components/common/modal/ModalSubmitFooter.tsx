import React, { ReactNode, SFC, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import i18next from 'i18next';

import { ActionGroup, Button } from '@patternfly/react-core';

import ModalFooter from './ModalFooter';

export type ModalSubmitFooterProps = {
  message?: string;
  errorMessage?: string;
  inProgress: boolean;
  cancel: (e: SyntheticEvent<any, Event>) => void;
  cancelText?: ReactNode;
  className?: string;
  resetText?: ReactNode;
  reset?: (e: SyntheticEvent<any, Event>) => void;
  submitText: ReactNode;
  submitDisabled?: boolean;
  submitDanger?: boolean;
  buttonAlignment?: 'left' | 'right';
};

const ModalSubmitFooter: SFC<ModalSubmitFooterProps> = ({
  message,
  errorMessage,
  inProgress,
  cancel,
  submitText,
  cancelText,
  className,
  submitDisabled,
  submitDanger,
  buttonAlignment = 'right',
  resetText = i18next.t('public~Reset'),
  reset,
}) => {
  const { t } = useTranslation();
  const onCancelClick = (e) => {
    e.stopPropagation();
    cancel(e);
  };

  const onResetClick = (e) => {
    e.stopPropagation();
    reset(e);
  };

  const cancelButton = (
    <Button
      type="button"
      variant="secondary"
      data-test-id="modal-cancel-action"
      onClick={onCancelClick}
      aria-label={t('public~Cancel')}
    >
      {cancelText || t('public~Cancel')}
    </Button>
  );

  const submitButton = submitDanger ? (
    <Button
      type="submit"
      variant="danger"
      isDisabled={submitDisabled}
      data-test="confirm-action"
      id="confirm-action"
    >
      {submitText}
    </Button>
  ) : (
    <Button
      type="submit"
      variant="primary"
      isDisabled={submitDisabled}
      data-test="confirm-action"
      id="confirm-action"
    >
      {submitText}
    </Button>
  );

  const resetButton = (
    <Button variant="link" isInline onClick={onResetClick} id="reset-action">
      {resetText}
    </Button>
  );

  return (
    <ModalFooter
      inProgress={inProgress}
      errorMessage={errorMessage}
      message={message}
      className={className}
    >
      <ActionGroup
        className={classNames(
          { 'pf-c-form__actions--right': buttonAlignment === 'right' },
          'pf-c-form  pf-c-form__group--no-top-margin',
        )}
      >
        {buttonAlignment === 'left' ? (
          <>
            {submitButton}
            {reset && resetButton}
            {cancelButton}
          </>
        ) : (
          <>
            {reset && resetButton}
            {cancelButton}
            {submitButton}
          </>
        )}
      </ActionGroup>
    </ModalFooter>
  );
};

export default ModalSubmitFooter;
