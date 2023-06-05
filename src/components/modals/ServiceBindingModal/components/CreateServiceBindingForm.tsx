import React, { FC } from 'react';
import { Trans } from 'react-i18next';
import { FormikProps, FormikValues } from 'formik';
import ModalTitle from 'src/components/common/modal/ModalTitle';

import { TextInputTypes, Title } from '@patternfly/react-core';
import { isEmpty } from '@topology-utils/common-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import ModalBody from '../../../common/modal/ModalBody';
import ModalSubmitFooter from '../../../common/modal/ModalSubmitFooter';
import FormSection from '../../../dev-console/FormSection';
import InputField from '../../../formik-fields/InputField/InputField';

import BindableServices from './BindableServices/BindableServices';

export type CreateServiceBindingFormProps = {
  source: K8sResourceKind;
  target?: K8sResourceKind;
  cancel?: () => void;
};

const CreateServiceBindingForm: FC<FormikProps<FormikValues> & CreateServiceBindingFormProps> = ({
  source,
  target,
  handleSubmit,
  isSubmitting,
  cancel,
  status,
  errors,
}) => {
  const { t } = useTopologyTranslation();

  const sourceName = source.metadata.name;
  const targetName = target?.metadata?.name;

  const title = target ? (
    <Trans t={t} ns="plugin__topology-plugin">
      Connect <b>{{ sourceName }}</b> to service <b>{{ targetName }}</b>.
    </Trans>
  ) : (
    t('Select a service to connect to.')
  );

  return (
    <form onSubmit={handleSubmit} className="modal-content">
      <ModalTitle>{t('Create Service Binding')}</ModalTitle>
      <ModalBody>
        <Title headingLevel="h2" size="md" className="co-m-form-row">
          {title}
        </Title>
        <FormSection fullWidth>
          <InputField type={TextInputTypes.text} name="name" label={t('Name')} required />
          {!target && <BindableServices resource={source} />}
        </FormSection>
      </ModalBody>
      <ModalSubmitFooter
        submitText={t('Create')}
        submitDisabled={isSubmitting || !isEmpty(errors)}
        cancel={cancel}
        inProgress={isSubmitting}
        errorMessage={status?.submitError}
      />
    </form>
  );
};

export default CreateServiceBindingForm;
