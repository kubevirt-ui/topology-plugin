import { useEffect } from 'react';
import { FormikValues, useFormikContext } from 'formik';

import { useDeepCompareMemoize } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useDeepCompareMemoize';

const useFormikValidationFix = (value: any) => {
  const { validateForm } = useFormikContext<FormikValues>();
  const memoizedValue = useDeepCompareMemoize(value);

  useEffect(() => {
    validateForm();
  }, [memoizedValue, validateForm]);
};

export default useFormikValidationFix;
