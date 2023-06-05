import React, { FC, useEffect, useState } from 'react';
import { connect, Dispatch } from 'react-redux';

import { useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk-internal';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import {
  ALL_APPLICATIONS_KEY,
  ALL_NAMESPACES_SESSION_KEY,
  APPLICATION_LOCAL_STORAGE_KEY,
  APPLICATION_USERSETTINGS_PREFIX,
  UNASSIGNED_APPLICATIONS_KEY,
} from '../../const';

import ApplicationDropdown from './ApplicationDropdown';

interface NamespaceBarApplicationSelectorProps {
  disabled?: boolean;
}

interface StateProps {
  application: string;
}

interface DispatchProps {
  onChange: (name: string) => void;
}

type Props = NamespaceBarApplicationSelectorProps & StateProps & DispatchProps;

const NamespaceBarApplicationSelector: FC<Props> = ({ application, onChange, disabled }) => {
  const [activeNamespace] = useActiveNamespace();
  const { t } = useTopologyTranslation();
  const allApplicationsTitle = t('All applications');
  const noApplicationsTitle = t('No application group');
  const dropdownTitle: string =
    // eslint-disable-next-line no-nested-ternary
    application === ALL_APPLICATIONS_KEY
      ? allApplicationsTitle
      : application === UNASSIGNED_APPLICATIONS_KEY
      ? noApplicationsTitle
      : application;
  const [title, setTitle] = useState<string>(dropdownTitle);
  useEffect(() => {
    if (!disabled) {
      setTitle(dropdownTitle);
    }
  }, [disabled, dropdownTitle]);
  if (activeNamespace === ALL_NAMESPACES_SESSION_KEY) return null;

  const onApplicationChange = (newApplication: string, key: string) => {
    key === ALL_APPLICATIONS_KEY ? onChange(key) : onChange(newApplication);
  };

  return (
    <ApplicationDropdown
      className="co-namespace-selector"
      buttonClassName="pf-m-plain"
      namespace={activeNamespace}
      title={title && <span className="btn-link__title">{title}</span>}
      titlePrefix={t('Application')}
      allSelectorItem={{
        allSelectorKey: ALL_APPLICATIONS_KEY,
        allSelectorTitle: allApplicationsTitle,
      }}
      noneSelectorItem={{
        noneSelectorKey: UNASSIGNED_APPLICATIONS_KEY,
        noneSelectorTitle: noApplicationsTitle,
      }}
      selectedKey={application || ALL_APPLICATIONS_KEY}
      onChange={onApplicationChange}
      userSettingsPrefix={APPLICATION_USERSETTINGS_PREFIX}
      storageKey={APPLICATION_LOCAL_STORAGE_KEY}
      disabled={disabled}
    />
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  application: getActiveApplication(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  onChange: (app: string) => {
    dispatch(setActiveApplication(app));
  },
});

export default connect<StateProps, DispatchProps, NamespaceBarApplicationSelectorProps>(
  mapStateToProps,
  mapDispatchToProps,
)(NamespaceBarApplicationSelector);
