import React, { FC, ReactNode } from 'react';

import withHandlePromise, {
  HandlePromiseProps,
} from '@topology-utils/higher-order-components/withHandlePromise';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import ModalBody from '../common/modal/ModalBody';
import ModalSubmitFooter from '../common/modal/ModalSubmitFooter';
import ModalTitle from '../common/modal/ModalTitle';

type ConfirmModalProps = HandlePromiseProps & {
  btnText: ReactNode;
  btnTextKey: string;
  cancel?: any;
  cancelText: ReactNode;
  cancelTextKey: string;
  close?: any;
  executeFn?: any;
  message: ReactNode;
  messageKey: string;
  title: ReactNode;
  titleKey: string;
  submitDanger: boolean;
};

const ConfirmModal: FC<ConfirmModalProps> = ({
  btnText,
  btnTextKey,
  cancel,
  cancelText,
  cancelTextKey,
  close,
  executeFn,
  message,
  messageKey,
  title,
  titleKey,
  submitDanger,
  handlePromise,
  errorMessage,
  inProgress,
}) => {
  const { t } = useTopologyTranslation();

  const handleSubmit = (event) => {
    event.preventDefault();
    handlePromise(
      executeFn(null, {
        supressNotifications: true,
      }),
      close,
    );
  };

  return (
    <form onSubmit={handleSubmit} name="form" className="modal-content">
      <ModalTitle>{titleKey ? t(titleKey) : title}</ModalTitle>
      <ModalBody>{messageKey ? t(messageKey) : message}</ModalBody>
      <ModalSubmitFooter
        errorMessage={errorMessage}
        inProgress={inProgress}
        submitText={btnTextKey ? t(btnTextKey) : btnText || t('Confirm')}
        cancel={cancel}
        cancelText={cancelTextKey ? t(cancelTextKey) : cancelText || t('Cancel')}
        submitDanger={submitDanger}
      />
    </form>
  );
};

const confirmModal = createModalLauncher(withHandlePromise<ConfirmModalProps>(ConfirmModal));

export default confirmModal;
