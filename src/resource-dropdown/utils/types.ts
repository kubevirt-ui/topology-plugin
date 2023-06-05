import { CSSProperties, ReactNode } from 'react';

export enum ValidatedOptions {
  success = 'success',
  error = 'error',
  warning = 'warning',
  default = 'default',
}

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

export interface DropdownFieldProps extends FieldProps {
  items?: object;
  selectedKey?: string;
  title?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  autocompleteFilter?: (text: string, item: object, key?: string) => boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
}
