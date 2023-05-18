import React, { FC } from 'react';

import { BlueInfoCircleIcon } from '@openshift-console/dynamic-plugin-sdk';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import Shortcut from './Shortcut/Shortcut';
import ShortcutTable from './ShortcutTable';

import './RegroupHint.scss';

const RegroupHint: FC = () => {
  const { t } = useTopologyTranslation();
  return (
    <div className="odc-regroup-hint">
      <BlueInfoCircleIcon className="odc-regroup-hint__icon" />
      <span className="odc-regroup-hint__text">
        <ShortcutTable>
          <Shortcut shift drag>
            {t('Edit application grouping')}
          </Shortcut>
        </ShortcutTable>
      </span>
    </div>
  );
};

export default RegroupHint;
