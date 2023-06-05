import { t } from '@topology-utils/hooks/useTopologyTranslation';

import { TopologyDisplayFilterType } from '../utils/types/topology-types';

export const SHOW_POD_COUNT_FILTER_ID = 'show-pod-count';
export const SHOW_LABELS_FILTER_ID = 'show-labels';
export const EXPAND_APPLICATION_GROUPS_FILTER_ID = 'expand-app-groups';
export const EXPAND_GROUPS_FILTER_ID = 'expand-groups';

export const DEFAULT_TOPOLOGY_FILTERS = [
  {
    type: TopologyDisplayFilterType.expand,
    id: EXPAND_GROUPS_FILTER_ID,
    labelKey: t('Expand groups'),
    priority: 1,
    value: true,
  },
  {
    type: TopologyDisplayFilterType.show,
    id: SHOW_POD_COUNT_FILTER_ID,
    labelKey: t('Pod count'),
    priority: 10,
    value: false,
  },
  {
    type: TopologyDisplayFilterType.show,
    id: SHOW_LABELS_FILTER_ID,
    labelKey: t('Labels'),
    priority: 900,
    value: true,
  },
  {
    type: TopologyDisplayFilterType.expand,
    id: EXPAND_APPLICATION_GROUPS_FILTER_ID,
    labelKey: t('Application groupings'),
    priority: 10,
    value: true,
  },
];

export const DEFAULT_SUPPORTED_FILTER_IDS = [SHOW_POD_COUNT_FILTER_ID, SHOW_LABELS_FILTER_ID];
