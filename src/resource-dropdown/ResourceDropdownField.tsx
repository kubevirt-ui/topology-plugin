import React, { FC } from 'react';
import cx from 'classnames';
import { FormikValues, useField, useFormikContext } from 'formik';

import {
  FirehoseResource,
  K8sResourceCommon,
  ResourcesObject,
  useK8sWatchResources,
  WatchK8sResources,
} from '@openshift-console/dynamic-plugin-sdk';
import { FormGroup } from '@patternfly/react-core';
import { getFieldId } from '@topology-utils/common-utils';
import useFormikValidationFix from '@topology-utils/hooks/useFormikValidationFix';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import { DropdownFieldProps } from './utils/types';
import ResourceDropdown, { ResourceDropdownItems } from './ResourceDropdown';

export interface ResourceDropdownFieldProps extends DropdownFieldProps {
  dataSelector: string[] | number[] | symbol[];
  resources: WatchK8sResources<any>[];
  showBadge?: boolean;
  onLoad?: (items: ResourceDropdownItems) => void;
  onChange?: (key: string, name?: string | object, resource?: K8sResourceKind) => void;
  resourceFilter?: (resource: K8sResourceKind) => boolean;
  autoSelect?: boolean;
  placeholder?: string;
  actionItems?: {
    actionTitle: string;
    actionKey: string;
  }[];
  appendItems?: ResourceDropdownItems;
  customResourceKey?: (key: string, resource: K8sResourceKind) => string;
  dataTest?: string;
  menuClassName?: string;
}

const ResourceDropdownField: FC<ResourceDropdownFieldProps> = ({
  label,
  helpText,
  required,
  fullWidth,
  dataSelector,
  resources,
  onLoad,
  resourceFilter,
  dataTest,
  ...props
}) => {
  const [field, { touched, error }] = useField(props.name);
  const { setFieldValue, setFieldTouched } = useFormikContext<FormikValues>();
  const fieldId = getFieldId(props.name, 'ns-dropdown');
  const [resourceData] = useK8sWatchResources<{ [key: string]: K8sResourceCommon[] }>(resources);

  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : '';

  useFormikValidationFix(field.value);

  return (
    <FormGroup
      fieldId={fieldId}
      label={label}
      helperText={helpText}
      helperTextInvalid={errorMessage}
      validated={isValid ? 'default' : 'error'}
      isRequired={required}
      data-test={dataTest}
    >
      <Firehose resources={resources}>
        <ResourceDropdown
          {...props}
          id={fieldId}
          dataSelector={dataSelector}
          selectedKey={field.value}
          dropDownClassName={cx({ 'dropdown--full-width': fullWidth })}
          onLoad={onLoad}
          resourceFilter={resourceFilter}
          onChange={(value: string, name: string | object, resource: K8sResourceKind) => {
            props.onChange && props.onChange(value, name, resource);
            setFieldValue(props.name, value);
            setFieldTouched(props.name, true);
          }}
        />
      </Firehose>
    </FormGroup>
  );
};

export default ResourceDropdownField;
