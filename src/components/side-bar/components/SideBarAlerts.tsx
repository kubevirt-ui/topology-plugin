import React, { FC } from 'react';

import {
  DetailsResourceAlert,
  DetailsResourceAlertContent,
  isDetailsResourceAlert,
  useResolvedExtensions,
} from '@openshift-console/dynamic-plugin-sdk';
import { useUserSettings } from '@openshift-console/dynamic-plugin-sdk-internal';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import { GraphElement, observer } from '@patternfly/react-topology';

import { USERSETTINGS_PREFIX } from '../../../const';

const SIDEBAR_ALERTS = 'sideBarAlerts';

const ResolveResourceAlerts: FC<{
  id?: string;
  useResourceAlertsContent?: (element: GraphElement) => DetailsResourceAlertContent;
  element: GraphElement;
}> = observer(function ResolveResourceAlerts({ id, useResourceAlertsContent, element }) {
  const [showAlert, setShowAlert, loaded] = useUserSettings(
    `${USERSETTINGS_PREFIX}.${SIDEBAR_ALERTS}.${id}.${element.getId()}`,
    true,
  );
  const alertConfigs = useResourceAlertsContent(element);
  if (!alertConfigs) return null;
  const { variant, content, actionLinks, dismissible, title } = alertConfigs;
  return loaded && showAlert ? (
    <Alert
      isInline
      variant={variant}
      title={title}
      actionLinks={actionLinks}
      actionClose={
        dismissible && (
          <AlertActionCloseButton
            onClose={() => {
              setShowAlert(false);
            }}
          />
        )
      }
    >
      {content}
    </Alert>
  ) : null;
});

const SideBarAlerts: FC<{ element: GraphElement }> = ({ element }) => {
  const [resourceAlertsExtension, resolved] =
    useResolvedExtensions<DetailsResourceAlert>(isDetailsResourceAlert);
  return resolved ? (
    <>
      {resourceAlertsExtension.map(({ uid, properties: { contentProvider, ...props } }) => {
        const key = `${uid}-${element.getId()}`;
        return (
          <ResolveResourceAlerts
            key={key}
            {...props}
            useResourceAlertsContent={contentProvider}
            element={element}
          />
        );
      })}
    </>
  ) : null;
};

export default SideBarAlerts;
