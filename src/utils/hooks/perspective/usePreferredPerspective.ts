import { Dispatch, SetStateAction } from 'react';

import { useUserSettings } from '@openshift-console/dynamic-plugin-sdk-internal';
import { PREFERRED_PERSPECTIVE_USER_SETTING_KEY } from '@topology-utils/hooks/perspective/utils/const';

const usePreferredPerspective = (): [string, Dispatch<SetStateAction<string>>, boolean] => {
  const [preferredPerspective, setPreferredPerspective, preferredPerspectiveLoaded] =
    useUserSettings<string>(PREFERRED_PERSPECTIVE_USER_SETTING_KEY);
  return [preferredPerspective, setPreferredPerspective, preferredPerspectiveLoaded];
};

export default usePreferredPerspective;
