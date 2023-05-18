import React, { FC } from 'react';
import cx from 'classnames';

import { CatalogItem } from '@openshift-console/dynamic-plugin-sdk';
import { Divider, Split, SplitItem } from '@patternfly/react-core';
import { CatalogType } from '@topology-utils/types/catalog-types';
import { CatalogLinkData, DetailsRendererFunction } from '@topology-utils/types/quick-search-types';

import QuickSearchDetails from './QuickSearchDetails';
import QuickSearchList from './QuickSearchList';

interface QuickSearchContentProps {
  catalogItems: CatalogItem[];
  catalogItemTypes: CatalogType[];
  searchTerm: string;
  namespace: string;
  selectedItemId: string;
  selectedItem: CatalogItem;
  limitItemCount?: number;
  onSelect: (itemId: string) => void;
  viewAll?: CatalogLinkData[];
  closeModal: () => void;
  detailsRenderer?: DetailsRendererFunction;
  onListChange?: (items: number) => void;
}

const QuickSearchContent: FC<QuickSearchContentProps> = ({
  catalogItems,
  catalogItemTypes,
  viewAll,
  searchTerm,
  namespace,
  selectedItem,
  selectedItemId,
  onSelect,
  closeModal,
  limitItemCount,
  detailsRenderer,
  onListChange,
}) => {
  return (
    <Split className="ocs-quick-search-content">
      <SplitItem
        className={cx('ocs-quick-search-content__list', {
          'ocs-quick-search-content__list--overflow': catalogItems.length >= limitItemCount,
        })}
      >
        <QuickSearchList
          listItems={catalogItems}
          limitItemCount={limitItemCount}
          catalogItemTypes={catalogItemTypes}
          viewAll={viewAll}
          selectedItemId={selectedItemId}
          searchTerm={searchTerm}
          namespace={namespace}
          onSelectListItem={onSelect}
          closeModal={closeModal}
          onListChange={onListChange}
        />
      </SplitItem>
      <Divider component="div" isVertical />
      <SplitItem className="ocs-quick-search-content__details">
        <QuickSearchDetails
          detailsRenderer={detailsRenderer}
          selectedItem={selectedItem}
          closeModal={closeModal}
        />
      </SplitItem>
    </Split>
  );
};

export default QuickSearchContent;
