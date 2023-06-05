import React from 'react';

import { YellowExclamationTriangleIcon } from '@openshift-console/dynamic-plugin-sdk';
import { ActionGroup, Button } from '@patternfly/react-core';
import withHandlePromise, {
  HandlePromiseProps,
} from '@topology-utils/higher-order-components/withHandlePromise';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { ModalComponentProps } from '@topology-utils/types/modal-context';

import ModalBody from '../common/modal/ModalBody';
import ModalFooter from '../common/modal/ModalFooter';
import ModalTitle from '../common/modal/ModalTitle';

export type ErrorModalProps = {
  error: string;
  title?: string;
} & ModalComponentProps &
  HandlePromiseProps;

const ModalErrorContent = withHandlePromise<ErrorModalProps>((props) => {
  const { t } = useTopologyTranslation();
  const { error, title, cancel } = props;
  const titleText = title || t('Error');
  return (
    <div className="modal-content">
      <ModalTitle>
        <YellowExclamationTriangleIcon className="co-icon-space-r" /> {titleText}
      </ModalTitle>
      <ModalBody>{error}</ModalBody>
      <ModalFooter inProgress={false} errorMessage="">
        <ActionGroup className="pf-c-form pf-c-form__actions--right pf-c-form__group--no-top-margin">
          <Button type="button" variant="primary" onClick={cancel}>
            {t('OK')}
          </Button>
        </ActionGroup>
      </ModalFooter>
    </div>
  );
});

const errorModal = createModalLauncher(ModalErrorContent);

export default errorModal;
