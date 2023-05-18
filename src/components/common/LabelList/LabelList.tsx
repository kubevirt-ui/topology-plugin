import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import isEqual from 'lodash.isequal';

import { K8sResourceKindReference } from '@openshift-console/dynamic-plugin-sdk';
import { LabelGroup as PfLabelGroup } from '@patternfly/react-core';
import { isEmpty } from '@topology-utils/common-utils';

import Label from './components/Label';

export type LabelListProps = WithTranslation & {
  labels: { [key: string]: string };
  kind: K8sResourceKindReference;
  expand?: boolean;
};

class TranslatedLabelList extends Component<LabelListProps> {
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props);
  }

  render() {
    const { labels, kind, t, expand = true } = this.props;
    const list = Object.entries(labels)?.map(([key, label]) => (
      <Label key={key} kind={kind} name={key} value={label} expand={expand} />
    ));

    return (
      <>
        {isEmpty(list) ? (
          <div className="text-muted" key="0">
            {t('plugin__topology-plugin~No labels')}
          </div>
        ) : (
          <PfLabelGroup
            className="co-label-group"
            defaultIsOpen={true}
            numLabels={20}
            data-test="label-list"
          >
            {list}
          </PfLabelGroup>
        )}
      </>
    );
  }
}

export const LabelList = withTranslation()(TranslatedLabelList);
