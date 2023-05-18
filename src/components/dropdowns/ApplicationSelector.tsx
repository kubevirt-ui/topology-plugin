import React, { ChangeEvent, FC, FocusEvent, useEffect, useRef, useState } from 'react';
import { FormikValues, useField, useFormikContext } from 'formik';

import { FormGroup, TextInputTypes, ValidatedOptions } from '@patternfly/react-core';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import { CREATE_APPLICATION_KEY, UNASSIGNED_KEY } from '../../const';
import { sanitizeApplicationValue } from '../../utils';
import { getFieldId, isEmpty } from '../../utils/common-utils';
import useFormikValidationFix from '../../utils/hooks/useFormikValidationFix';
import InputField from '../formik-fields/InputField/InputField';

import ApplicationDropdown from './ApplicationDropdown';

interface ApplicationSelectorProps {
  namespace?: string;
  noProjectsAvailable?: boolean;
  subPath?: string;
}

const ApplicationSelector: FC<ApplicationSelectorProps> = ({
  namespace,
  noProjectsAvailable,
  subPath,
}) => {
  const { t } = useTopologyTranslation();
  const [applicationsAvailable, setApplicationsAvailable] = useState(true);
  const availableApplications = useRef<string[]>([]);
  const projectsAvailable = !noProjectsAvailable;

  const [selectedKey, { touched, error }] = useField(
    subPath ? `${subPath}.application.selectedKey` : 'application.selectedKey',
  );
  const [nameField] = useField(subPath ? `${subPath}.application.name` : 'application.name');
  const { setFieldValue, setFieldTouched } = useFormikContext<FormikValues>();
  const [applicationExists, setApplicationExists] = useState<boolean>(false);
  const applicationNameInputRef = useRef<HTMLInputElement>();
  const fieldId = getFieldId('application-name', 'dropdown');
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : '';

  useFormikValidationFix(selectedKey.value);

  const onDropdownChange = (key: string, application: string) => {
    setFieldValue(selectedKey.name, key);
    setFieldTouched(selectedKey.name, true);
    setFieldValue(nameField.name, sanitizeApplicationValue(application, key));
    setFieldTouched(nameField.name, true);
    setApplicationExists(false);
  };

  const handleOnLoad = (applicationList: { [key: string]: string }) => {
    const noApplicationsAvailable = isEmpty(applicationList);
    setApplicationsAvailable(!noApplicationsAvailable);
    availableApplications.current = Object.keys(applicationList);
    if (noApplicationsAvailable) {
      setFieldValue(selectedKey.name, '');
      setFieldValue(
        nameField.name,
        (selectedKey.value !== UNASSIGNED_KEY && nameField.value) ?? '',
      );
    }
  };

  const actionItems = [
    {
      actionTitle: t('Create application'),
      actionKey: CREATE_APPLICATION_KEY,
    },
    {
      actionTitle: t('No application group'),
      actionKey: UNASSIGNED_KEY,
    },
  ];

  const handleAppChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApplicationExists(availableApplications.current.includes(event.target.value.trim()));
  };

  const handleAppBlur = (event: FocusEvent<HTMLInputElement>) => {
    const trimmedApplicationName = event.target.value.trim();
    setFieldValue(nameField.name, trimmedApplicationName);
  };

  const label = t('Application');
  const inputHelpText = applicationExists
    ? t('Warning: the application grouping already exists.')
    : t('A unique name given to the application grouping to label your resources.');

  useEffect(() => {
    if (selectedKey.value === CREATE_APPLICATION_KEY) {
      applicationNameInputRef.current?.focus();
    }
  }, [selectedKey.value]);

  return (
    <>
      {projectsAvailable && applicationsAvailable && (
        <FormGroup
          fieldId={fieldId}
          label={label}
          helperTextInvalid={errorMessage}
          validated={isValid ? 'default' : 'error'}
          helperText={t('Select an Application to group this component.')}
        >
          <ApplicationDropdown
            id={fieldId}
            ariaLabel={label}
            dropDownClassName="dropdown--full-width"
            menuClassName="dropdown-menu--text-wrap"
            namespace={namespace}
            actionItems={actionItems}
            autoSelect
            selectedKey={selectedKey.value}
            onChange={onDropdownChange}
            onLoad={handleOnLoad}
          />
        </FormGroup>
      )}
      {(!applicationsAvailable || selectedKey.value === CREATE_APPLICATION_KEY) && (
        <InputField
          type={TextInputTypes.text}
          required={selectedKey.value === CREATE_APPLICATION_KEY}
          name={nameField.name}
          ref={applicationNameInputRef}
          label={t('Application name')}
          data-test-id="application-form-app-input"
          helpText={inputHelpText}
          validated={applicationExists ? ValidatedOptions.warning : ValidatedOptions.default}
          onChange={handleAppChange}
          onBlur={handleAppBlur}
        />
      )}
    </>
  );
};

export default ApplicationSelector;
