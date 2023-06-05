import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { modelToRef } from '@kubevirt-ui/kubevirt-api/console';
import { k8sPatch, ResourceIcon } from '@openshift-console/dynamic-plugin-sdk';
import {
  ActionList,
  ActionListItem,
  Alert,
  AlertVariant,
  Button,
  Form,
  Modal,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { isEmpty } from '@topology-utils/common-utils';
import withHandlePromise, {
  HandlePromiseProps,
} from '@topology-utils/higher-order-components/withHandlePromise';

import { TEMPLATE_SELECTOR_PATH } from './utils/const';
import SelectorInput from './utils/SelectorInput';

type BaseLabelsModalProps = {
  kind: any;
  path: any;
  resource: any;
  isPodSelector: any;
  close: any;
  descriptionKey: any;
  messageKey: any;
  messageVariables: any;
  labelClassName: any;
  cancel: any;
} & HandlePromiseProps;

const BaseLabelsModal = withHandlePromise<BaseLabelsModalProps>((props) => {
  const [labels, setLabels] = useState(
    SelectorInput.arrayify(get(props.resource, props.path.split('/').slice(1))),
  );
  const createPath = !labels.length;
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();

    const { kind, path, resource, isPodSelector } = props;

    const patch = [
      {
        op: createPath ? 'add' : 'replace',
        path,
        value: SelectorInput.objectify(labels),
      },
    ];

    // https://kubernetes.io/docs/user-guide/deployments/#selector
    //   .spec.selector must match .spec.template.metadata.labels, or it will be rejected by the API
    const updateTemplate =
      isPodSelector && !isEmpty(get(resource, TEMPLATE_SELECTOR_PATH.split('/').slice(1)));

    if (updateTemplate) {
      patch.push({
        path: TEMPLATE_SELECTOR_PATH,
        op: 'replace',
        value: SelectorInput.objectify(labels),
      });
    }
    const promise = k8sPatch({ model: kind, resource, data: patch });
    props.handlePromise(promise, props.close);
  };

  const {
    cancel,
    kind,
    resource,
    descriptionKey,
    messageKey,
    messageVariables,
    labelClassName,
    errorMessage,
  } = props;

  const modalTitle = messageKey
    ? t(messageKey, messageVariables)
    : t(
        'Labels help you organize and select resources. Adding labels below will let you query for objects that have similar, overlapping or dissimilar labels.',
      );

  return (
    <Modal
      variant={'small'}
      className="ods-modal"
      onClose={close}
      title={modalTitle}
      footer={
        <Stack className="base-labels-modal-footer" hasGutter>
          {errorMessage && (
            <StackItem>
              <Alert isInline variant={AlertVariant.danger} title={t('An error occurred')}>
                <Stack hasGutter>
                  <StackItem>{errorMessage}</StackItem>
                </Stack>
              </Alert>
            </StackItem>
          )}
          <StackItem>
            <ActionList>
              <ActionListItem>
                <Button onClick={handleSubmit} variant={'primary'}>
                  {t('Save')}
                </Button>
              </ActionListItem>
              <ActionListItem>
                <Button onClick={cancel} variant="link">
                  {t('Cancel')}
                </Button>
              </ActionListItem>
            </ActionList>
          </StackItem>
        </Stack>
      }
    >
      <Form>
        <div className="row co-m-form-row">
          <div className="col-sm-12">
            {messageKey
              ? t(messageKey, messageVariables)
              : t(
                  'Labels help you organize and select resources. Adding labels below will let you query for objects that have similar, overlapping or dissimilar labels.',
                )}
          </div>
        </div>
        <div className="row co-m-form-row">
          <div className="col-sm-12">
            <label htmlFor="tags-input" className="control-label">
              {descriptionKey
                ? t('{{description}} for', { description: t(descriptionKey) })
                : t('Labels for')}{' '}
              <ResourceIcon kind={kind.crd ? modelToRef(kind) : kind.kind} />{' '}
              {resource.metadata.name}
            </label>
            <SelectorInput
              onChange={(l) => setLabels(l)}
              tags={labels}
              labelClassName={labelClassName || `co-m-${kind.id}`}
              autoFocus={true}
            />
          </div>
        </div>
      </Form>
    </Modal>
  );
});

export default BaseLabelsModal;
