import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';

import { K8sKind, k8sPatch } from '@openshift-console/dynamic-plugin-sdk';
import { getLimitsDataFromResource, getResourceLimitsData } from '@topology-utils/resource-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';
import { limitsValidationSchema } from '@topology-utils/validation-schema-utils';

export type ResourceLimitsModalProps = {
  model: K8sKind;
  resource: K8sResourceKind;
  close?: () => void;
  isOpen: boolean;
  onClose: () => void;
  appendTo: () => HTMLElement;
};

const rlValidationSchema = () =>
  yup.object().shape({
    limits: limitsValidationSchema(),
  });

const ResourceLimitsModal: React.FC<ResourceLimitsModalProps> = (props) => {
  const handleSubmit = (values, actions) => {
    const {
      limits: { cpu, memory },
    } = values;
    const resources = getResourceLimitsData({ cpu, memory });

    return k8sPatch({
      model: props.model,
      resource: props.resource,
      data: [
        {
          op: 'replace',
          path: `/spec/template/spec/containers/0/resources`,
          value: resources,
        },
      ],
    })
      .then(() => {
        props.close();
      })
      .catch((error) => {
        actions.setStatus({ submitError: error });
      });
  };

  const currentValues = {
    limits: getLimitsDataFromResource(props.resource),
    container: props.resource.spec.template.spec.containers[0].name,
  };

  return (
    <Formik
      initialValues={currentValues}
      onSubmit={handleSubmit}
      validationSchema={rlValidationSchema()}
    >
      {(formikProps) => <ResourceLimitsModal {...formikProps} {...props} />}
    </Formik>
  );
};

export const resourceLimitsModal = createModalLauncher((props: ResourceLimitsModalProps) => (
  <ResourceLimitsModal {...props} />
));
