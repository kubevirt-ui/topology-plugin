import { CSSProperties, ReactNode } from 'react';

import { TextInputTypes, ValidatedOptions } from '@patternfly/react-core';

export interface FieldProps {
  name: string;
  label?: ReactNode;
  helpText?: ReactNode;
  helpTextInvalid?: ReactNode;
  required?: boolean;
  style?: CSSProperties;
  isReadOnly?: boolean;
  className?: string;
  isDisabled?: boolean;
  validated?: ValidatedOptions;
  dataTest?: string;
}

export interface BaseInputFieldProps extends FieldProps {
  type?: TextInputTypes;
  placeholder?: string;
  onChange?: (event) => void;
  onBlur?: (event) => void;
  autoComplete?: string;
}
