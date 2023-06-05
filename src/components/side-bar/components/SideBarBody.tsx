import React, { FC, useCallback } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore:
// FIXME missing exports due to out-of-sync @types/react-redux version
import { useDispatch, useSelector } from 'react-redux';

import { GraphElement } from '@patternfly/react-topology';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { Tab } from '@topology-utils/types/commonTypes';

import useQueryParams from '../../../utils/hooks/useQueryParams';
import SideBarTabLoader from '../providers/SideBarTabLoader';

const SimpleTabNavWrapper: FC<{ tabs: Tab[] }> = ({ tabs }) => {
  const { t } = useTopologyTranslation();
  const selectedTab = useSelector(({ UI }) => UI.getIn(['overview', 'selectedDetailsTab']));
  const dispatch = useDispatch();
  const queryParams = useQueryParams();
  const selectTabParam = queryParams.get('selectTab');
  const handleClickTab = useCallback(
    (name) => {
      dispatch(UIActions.selectOverviewDetailsTab(name));
    },
    [dispatch],
  );
  return (
    <SimpleTabNav
      selectedTab={selectTabParam || selectedTab || t('Details')}
      tabs={tabs}
      tabProps={null}
      onClickTab={handleClickTab}
      additionalClassNames="co-m-horizontal-nav__menu--within-sidebar co-m-horizontal-nav__menu--within-overview-sidebar"
    />
  );
};

const SideBarBody: FC<{ element: GraphElement }> = ({ element }) => {
  const uid = element.getId();
  return (
    <SideBarTabLoader key={uid} element={element}>
      {(tabs, loaded) => (loaded ? <SimpleTabNavWrapper tabs={tabs} /> : null)}
    </SideBarTabLoader>
  );
};

export default SideBarBody;
