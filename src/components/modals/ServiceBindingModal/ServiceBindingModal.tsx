import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';

import { K8sKind, k8sList, Perspective } from '@openshift-console/dynamic-plugin-sdk';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { getQueryArgument } from '@topology-utils/common-utils';
import usePerspectives from '@topology-utils/hooks/perspective/usePerspectives';
import useValuesForPerspectiveContext from '@topology-utils/hooks/perspective/useValuesForPerspectiveContext';
import useTelemetry from '@topology-utils/hooks/useTelemetry/useTelemetry';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import { ServiceBindingModel } from '../../../models/ServiceBindingModel';
import { createServiceBinding } from '../../../operators/actions/serviceBindings';

import CreateServiceBindingForm, {
  CreateServiceBindingFormProps,
} from './components/CreateServiceBindingForm';
import { checkExistingServiceBinding, serviceBindingValidationSchema } from './utils/utils';

type CreateServiceBindingModalProps = CreateServiceBindingFormProps & {
  model: K8sKind;
  source: K8sResourceKind;
  target?: K8sResourceKind;
  close?: () => void;
};

type CreateServiceBindingFormType = {
  name: string;
  bindableService: K8sResourceKind;
};

const handleRedirect = async (
  history: any,
  project: string,
  perspective: string,
  perspectiveExtensions: Perspective[],
) => {
  const perspectiveData = perspectiveExtensions.find((item) => item.properties.id === perspective);
  const redirectURL = (await perspectiveData.properties.importRedirectURL())(project);
  history.push(redirectURL);
};

const ServiceBindingModal: FC<CreateServiceBindingModalProps> = (props) => {
  const { source, model } = props;
  const history = useHistory();
  const { t } = useTopologyTranslation();
  const fireTelemetryEvent = useTelemetry();
  const [activePerspective] = useValuesForPerspectiveContext();
  const perspectiveExtensions = usePerspectives();
  const handleSubmit = async (values, actions) => {
    const bindings = await k8sList({
      model: ServiceBindingModel,
      queryParams: {
        ns: source.metadata.namespace,
      },
    });
    let existingServiceBinding = {};
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (bindings.length > 0) {
      existingServiceBinding = checkExistingServiceBinding(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        bindings,
        source,
        values.bindableService,
        model,
      );
    }
    if (Object.keys(existingServiceBinding ?? {}).length === 0) {
      try {
        await createServiceBinding(source, values.bindableService, values.name);
        props.close();
        fireTelemetryEvent('Service Binding Created');
        getQueryArgument('view') === null &&
          handleRedirect(
            history,
            source.metadata.namespace,
            activePerspective,
            perspectiveExtensions,
          );
      } catch (errorMessage) {
        actions.setStatus({ submitError: errorMessage.message });
      }
    } else {
      actions.setStatus({
        submitError: t('Service binding already exists. Select a different service to connect to.'),
      });
    }
  };

  const initialValues: CreateServiceBindingFormType = {
    name: props.target
      ? `${source.metadata.name}-${model.abbr.toLowerCase()}-${
          props.target.metadata.name
        }-${getK8sModel(props.target).abbr.toLowerCase()}`
      : '',
    bindableService: props.target ? props.target : {},
  };
  return (
    <Formik
      initialValues={initialValues}
      initialStatus={{ error: '' }}
      validationSchema={serviceBindingValidationSchema()}
      onSubmit={handleSubmit}
    >
      {(formikProps) => <CreateServiceBindingForm {...formikProps} {...props} />}
    </Formik>
  );
};

export const createServiceBindingModal = createModalLauncher(ServiceBindingModal);
