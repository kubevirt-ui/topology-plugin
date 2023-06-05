import React from 'react';
import get from 'lodash.get';
import ModalTitle from 'src/components/common/modal/ModalTitle';

import { DeploymentModel } from '@kubevirt-ui/kubevirt-api/console';
import { k8sPatch, Patch } from '@openshift-console/dynamic-plugin-sdk';
import withHandlePromise, {
  HandlePromiseProps,
} from '@topology-utils/higher-order-components/withHandlePromise';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import ModalBody from '../../common/modal/ModalBody';
import ModalSubmitFooter from '../../common/modal/ModalSubmitFooter';

import ConfigureUpdateStrategy from './components/ConfigureUpdateStrategy';
import { getNumberOrPercent } from './utils/utils';

export type ConfigureUpdateStrategyModalProps = {
  deployment: K8sResourceKind;
  handlePromise: <T>(promise: Promise<T>) => Promise<T>;
  inProgress: boolean;
  errorMessage: string;
  cancel?: () => void;
  close?: () => void;
} & HandlePromiseProps;

const ConfigureUpdateStrategyModal = withHandlePromise(
  (props: ConfigureUpdateStrategyModalProps) => {
    const [strategyType, setStrategyType] = React.useState(
      get(props.deployment.spec, 'strategy.type'),
    );
    const [maxUnavailable, setMaxUnavailable] = React.useState(
      get(props.deployment.spec, 'strategy.rollingUpdate.maxUnavailable', '25%'),
    );
    const [maxSurge, setMaxSurge] = React.useState(
      get(props.deployment.spec, 'strategy.rollingUpdate.maxSurge', '25%'),
    );

    const { t } = useTopologyTranslation();

    const submit = (event) => {
      event.preventDefault();

      const patch: Patch = { path: '/spec/strategy/rollingUpdate', op: 'remove' };
      if (strategyType === 'RollingUpdate') {
        patch.value = {
          maxUnavailable: getNumberOrPercent(maxUnavailable || '25%'),
          maxSurge: getNumberOrPercent(maxSurge || '25%'),
        };
        patch.op = 'add';
      }
      const promise = k8sPatch({
        model: DeploymentModel,
        resource: props.deployment,
        data: [patch, { path: '/spec/strategy/type', value: strategyType, op: 'replace' }],
      });
      props.handlePromise(promise, props.close);
    };

    return (
      <form onSubmit={submit} name="form" className="modal-content">
        <ModalTitle>{t('Edit update strategy')}</ModalTitle>
        <ModalBody>
          <ConfigureUpdateStrategy
            strategyType={strategyType}
            maxUnavailable={maxUnavailable}
            maxSurge={maxSurge}
            onChangeStrategyType={setStrategyType}
            onChangeMaxUnavailable={setMaxUnavailable}
            onChangeMaxSurge={setMaxSurge}
          />
        </ModalBody>
        <ModalSubmitFooter
          errorMessage={props.errorMessage}
          inProgress={props.inProgress}
          submitText={t('Save')}
          cancel={props.cancel}
        />
      </form>
    );
  },
);

export const configureUpdateStrategyModal = createModalLauncher(ConfigureUpdateStrategyModal);

export default ConfigureUpdateStrategyModal;
