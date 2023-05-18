import React, { FC } from 'react';

import { Selector as SelectorKind } from '@openshift-console/dynamic-plugin-sdk';
import { isEmpty } from '@topology-utils/common-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import Requirement from './Selector/components/Requirement';

type SelectorProps = {
  kind?: string;
  selector: SelectorKind;
  namespace?: string;
};

const Selector: FC<SelectorProps> = ({ kind = 'Pod', selector = {}, namespace = undefined }) => {
  const { t } = useTopologyTranslation();
  return (
    <div className="co-m-selector">
      {isEmpty(selector) ? (
        <p className="text-muted">{t('No selector')}</p>
      ) : (
        <Requirement kind={kind} requirements={selector} namespace={namespace} />
      )}
    </div>
  );
};

export default Selector;
