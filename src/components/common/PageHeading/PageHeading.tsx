import React, { FC } from 'react';
import classNames from 'classnames';
import get from 'lodash.get';
import isFunction from 'lodash.isfunction';

import { ResourceIcon, ResourceStatus } from '@openshift-console/dynamic-plugin-sdk';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
import { Split, SplitItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { isEmpty } from '@topology-utils/common-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import ManagedByOperatorLink from '../ManagedByOperatorLink/ManagedByOperatorLink';

import BreadCrumbs from './components/BreadCrumbs';
import { PageHeadingProps } from './utils/types';

const PageHeading: FC<PageHeadingProps> = (props) => {
  const {
    kind,
    kindObj,
    detail,
    title,
    menuActions,
    buttonActions,
    customActionMenu,
    link,
    obj,
    breadcrumbs,
    breadcrumbsFor,
    titleFunc,
    style,
    customData,
    badge,
    getResourceStatus = (resource: K8sResourceKind): string =>
      get(resource, ['status', 'phase'], null),
    className,
    centerText,
    helpText,
    'data-test': dataTestId,
  } = props;
  const extraResources = props.resourceKeys?.reduce(
    (extraObjs, key) => ({ ...extraObjs, [key]: get(props[key], 'data') }),
    {},
  );
  const data = get(obj, 'data');
  const resourceTitle = titleFunc && data ? titleFunc(data) : title;
  const hasButtonActions = !isEmpty(buttonActions);
  const hasMenuActions = isFunction(menuActions) || !isEmpty(menuActions);
  const hasData = !isEmpty(data);
  const showActions =
    (hasButtonActions || hasMenuActions || customActionMenu) &&
    hasData &&
    !get(data, 'metadata.deletionTimestamp');
  const resourceStatus = hasData && getResourceStatus ? getResourceStatus(data) : null;
  const showHeading = props.icon || kind || resourceTitle || resourceStatus || badge || showActions;
  const showBreadcrumbs = breadcrumbs || (breadcrumbsFor && !isEmpty(data));
  return (
    <>
      {showBreadcrumbs && (
        <div className="pf-c-page__main-breadcrumb">
          <Split style={{ alignItems: 'baseline' }}>
            <SplitItem isFilled>
              <BreadCrumbs breadcrumbs={breadcrumbs || breadcrumbsFor(data)} />
            </SplitItem>
            {badge && (
              <SplitItem>{<span className="co-m-pane__heading-badge">{badge}</span>}</SplitItem>
            )}
          </Split>
        </div>
      )}
      <div
        data-test-id={dataTestId}
        className={classNames(
          'co-m-nav-title',
          { 'co-m-nav-title--detail': detail },
          { 'co-m-nav-title--logo': props.icon },
          { 'co-m-nav-title--breadcrumbs': showBreadcrumbs },
          className,
        )}
        style={style}
      >
        {showHeading && (
          <Text
            component={TextVariants.h1}
            className={classNames('co-m-pane__heading', {
              'co-m-pane__heading--baseline': link,
              'co-m-pane__heading--center': centerText,
              'co-m-pane__heading--logo': props.icon,
              'co-m-pane__heading--with-help-text': helpText,
            })}
          >
            {props.icon ? (
              <props.icon obj={data} />
            ) : (
              <div className="co-m-pane__name co-resource-item">
                {kind && <ResourceIcon kind={kind} className="co-m-resource-icon--lg" />}{' '}
                <span data-test-id="resource-title" className="co-resource-item__resource-name">
                  {resourceTitle}
                  {data?.metadata?.namespace && data?.metadata?.ownerReferences?.length && (
                    <ManagedByOperatorLink obj={data} />
                  )}
                </span>
                {resourceStatus && (
                  <ResourceStatus additionalClassNames="hidden-xs">
                    <Status status={resourceStatus} />
                  </ResourceStatus>
                )}
              </div>
            )}
            {!breadcrumbsFor && !breadcrumbs && badge && (
              <span className="co-m-pane__heading-badge">{badge}</span>
            )}
            {link && <div className="co-m-pane__heading-link">{link}</div>}
            {showActions && (
              <div className="co-actions" data-test-id="details-actions">
                {hasButtonActions && (
                  <ActionButtons actionButtons={buttonActions.map((a) => a(kindObj, data))} />
                )}
                {hasMenuActions && (
                  <ActionsMenu
                    actions={
                      isFunction(menuActions)
                        ? menuActions(kindObj, data, extraResources, customData)
                        : menuActions.map((a) => a(kindObj, data, extraResources, customData))
                    }
                  />
                )}
                {isFunction(customActionMenu) ? customActionMenu(kindObj, data) : customActionMenu}
              </div>
            )}
          </Text>
        )}
        {helpText && (
          <TextContent>
            <Text component={TextVariants.p} className="help-block co-m-pane__heading-help-text">
              {helpText}
            </Text>
          </TextContent>
        )}
        {props.children}
      </div>
    </>
  );
};

export default PageHeading;
