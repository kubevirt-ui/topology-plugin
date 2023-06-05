import React, { ComponentType, FC, ReactNode } from 'react';
import get from 'lodash.get';

import {
  IncompleteDataError,
  TimeoutError,
} from '@openshift-console/dynamic-plugin-sdk/lib/utils/error/http-error';
import { Alert } from '@patternfly/react-core';
import { getLastLanguage, isEmpty } from '@topology-utils/common-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import Data from '../LoadingInline/components/Data';
import LoadError from '../LoadingInline/components/LoadError';

import AccessDenied from './components/AccessDenied';
import LoadingBox from './components/LoadingBox';

type StatusBoxProps = {
  label?: string;
  loadError?: any;
  loaded?: boolean;
  data?: any;
  unfilteredData?: any;
  skeleton?: ReactNode;
  NoDataEmptyMsg?: ComponentType;
  EmptyMsg?: ComponentType;
  children?: ReactNode;
};

const StatusBox: FC<StatusBoxProps> = (props) => {
  const { loadError, loaded, skeleton, data, ...dataProps } = props;
  const { t } = useTopologyTranslation();

  if (loadError) {
    const status = get(loadError, 'response.status');
    if (status === 404) {
      return (
        <div className="co-m-pane__body">
          <h1 className="co-m-pane__heading co-m-pane__heading--center">{t('404: Not Found')}</h1>
        </div>
      );
    }
    if (status === 403) {
      return <AccessDenied message={loadError.message} />;
    }

    if (loadError instanceof IncompleteDataError && !isEmpty(data)) {
      return (
        <Data data={data} {...dataProps}>
          <Alert
            variant="info"
            isInline
            title={t(
              '{{labels}} content is not available in the catalog at this time due to loading failures.',
              {
                labels: new Intl.ListFormat(getLastLanguage() || 'en', {
                  style: 'long',
                  type: 'conjunction',
                }).format(loadError.labels),
              },
            )}
          />
          {props.children}
        </Data>
      );
    }

    if (loaded && loadError instanceof TimeoutError) {
      return (
        <Data data={data} {...dataProps}>
          <div className="co-m-timeout-error text-muted">
            {t('Timed out fetching new data. The data below is stale.')}
          </div>
          {props.children}
        </Data>
      );
    }

    return (
      <LoadError
        message={loadError.message}
        label={props.label}
        className="loading-box loading-box__errored"
      />
    );
  }

  if (!loaded) {
    return skeleton ? <>{skeleton}</> : <LoadingBox className="loading-box loading-box__loading" />;
  }
  return <Data data={data} {...dataProps} />;
};

export default StatusBox;
