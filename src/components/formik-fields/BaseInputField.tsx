import React, { FC, ReactNode } from 'react';
import { useField } from 'formik';

import { FormGroup, ValidatedOptions } from '@patternfly/react-core';

import { getFieldId } from '../../utils/common-utils';
import useFormikValidationFix from '../../utils/hooks/useFormikValidationFix';

import { BaseInputFieldProps } from './utils/types';

const BaseInputField: FC<
  BaseInputFieldProps & {
    children: (props) => ReactNode;
  }
> = ({
  label,
  helpText,
  required,
  children,
  name,
  onChange,
  onBlur,
  helpTextInvalid,
  validated,
  ...props
}) => {
  const [field, { touched, error }] = useField({ name, type: 'input' });
  const fieldId = getFieldId(name, 'input');
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : '';
  useFormikValidationFix(field.value);
  return (
    <FormGroup
      fieldId={fieldId}
      label={label}
      helperText={helpText}
      helperTextInvalid={errorMessage || helpTextInvalid}
      validated={!isValid ? ValidatedOptions.error : validated}
      isRequired={required}
    >
      {children({
        ...field,
        ...props,
        value: field.value || '',
        id: fieldId,
        label,
        validated: !isValid ? ValidatedOptions.error : validated,
        'aria-describedby': helpText ? `${fieldId}-helper` : undefined,
        onChange: (value, event) => {
          field.onChange(event);
          onChange && onChange(event);
        },
        onBlur: (event) => {
          field.onBlur(event);
          onBlur && onBlur(event);
        },
      })}
    </FormGroup>
  );
};

export default BaseInputField;
