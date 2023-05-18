import { Dispatch, SetStateAction } from 'react';

import { PerspectiveType } from '@openshift-console/dynamic-plugin-sdk';
import {
  LAST_PERSPECTIVE_LOCAL_STORAGE_KEY,
  LAST_PERSPECTIVE_USER_SETTINGS_KEY,
} from '@topology-utils/hooks/perspective/utils/const';
import { useUserSettingsCompatibility } from '@topology-utils/hooks/useUserSettingsCompatibility/useUserSettingsCompatibility';

const useLastPerspective = (): [string, Dispatch<SetStateAction<string>>, boolean] =>
  useUserSettingsCompatibility<PerspectiveType>(
    LAST_PERSPECTIVE_USER_SETTINGS_KEY,
    LAST_PERSPECTIVE_LOCAL_STORAGE_KEY,
    '',
  );

export default useLastPerspective;
