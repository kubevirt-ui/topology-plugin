import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { CatalogItem } from '@openshift-console/dynamic-plugin-sdk';
import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Label,
  Split,
  SplitItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { getImageForIconClass } from '@topology-utils';
import { getIconProps } from '@topology-utils/catalog-utils';
import useTelemetry from '@topology-utils/hooks/useTelemetry/useTelemetry';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { handleCta } from '@topology-utils/quick-search-utils';
import { CatalogType } from '@topology-utils/types/catalog-types';
import { CatalogLinkData } from '@topology-utils/types/quick-search-types';

interface QuickSearchListProps {
  listItems: CatalogItem[];
  catalogItemTypes: CatalogType[];
  viewAll?: CatalogLinkData[];
  selectedItemId: string;
  searchTerm: string;
  namespace: string;
  limitItemCount?: number;
  onSelectListItem: (itemId: string) => void;
  onListChange?: (items: number) => void;
  closeModal: () => void;
}

const QuickSearchList: React.FC<QuickSearchListProps> = ({
  listItems,
  catalogItemTypes,
  viewAll,
  selectedItemId,
  onSelectListItem,
  closeModal,
  limitItemCount,
  onListChange,
}) => {
  const { t } = useTopologyTranslation();
  const fireTelemetryEvent = useTelemetry();
  const [itemsCount, setItemsCount] = React.useState<number>(limitItemCount || listItems.length);
  const listHeight = document.querySelector('.ocs-quick-search-list__list')?.clientHeight || 0;

  const getIcon = (item: CatalogItem) => {
    const { iconImg, iconClass } = getIconProps(item);
    return (
      <img
        className="ocs-quick-search-list__item-icon-img"
        src={iconClass ? getImageForIconClass(iconClass) : iconImg}
        alt={`${item.name} icon`}
      />
    );
  };
  React.useLayoutEffect(() => {
    if (selectedItemId) {
      const element = document.getElementById(selectedItemId);
      if (element) {
        element.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedItemId]);

  React.useEffect(() => {
    if (listHeight > 0 && limitItemCount > 0) {
      const rowHeight = document.querySelector('.ocs-quick-search-list__item')?.clientHeight || 0;
      const count =
        Math.floor(listHeight / rowHeight) < limitItemCount
          ? limitItemCount
          : Math.floor(listHeight / rowHeight);
      setItemsCount(count);
      onListChange?.(count);
    }
  }, [limitItemCount, listHeight, onListChange]);

  return (
    <div className="ocs-quick-search-list">
      <DataList
        className="ocs-quick-search-list__list"
        aria-label={t('console-shared~Quick search list')}
        selectedDataListItemId={selectedItemId}
        onSelectDataListItem={onSelectListItem}
        isCompact
      >
        {listItems.slice(0, itemsCount).map((item) => {
          const itemType =
            catalogItemTypes.find((type) => type.value === item.type)?.label || item.type;

          return (
            <DataListItem
              id={item.uid}
              key={item.uid}
              tabIndex={-1}
              className={cx('ocs-quick-search-list__item', {
                'ocs-quick-search-list__item--highlight': item.uid === selectedItemId,
              })}
              onDoubleClick={(e: React.SyntheticEvent) => {
                handleCta(e, item, closeModal, fireTelemetryEvent);
              }}
            >
              <DataListItemRow className="ocs-quick-search-list__item-row">
                <DataListItemCells
                  className="ocs-quick-search-list__item-content"
                  dataListCells={[
                    <DataListCell isIcon key={`${item.uid}-icon`}>
                      <div className="ocs-quick-search-list__item-icon">
                        {item.icon?.node ?? getIcon(item)}
                      </div>
                    </DataListCell>,
                    <DataListCell
                      style={{ paddingTop: 'var(--pf-global--spacer--sm)' }}
                      width={2}
                      wrapModifier="truncate"
                      key={`${item.uid}-name`}
                    >
                      <span
                        className="ocs-quick-search-list__item-name"
                        data-test={`item-name-${item.name}-${itemType}`}
                      >
                        {item.name}
                      </span>
                      <Split style={{ alignItems: 'center' }} hasGutter>
                        <SplitItem>
                          <Label>{itemType}</Label>
                        </SplitItem>
                        <SplitItem>
                          {item.secondaryLabel ?? (
                            <TextContent>
                              <Text component={TextVariants.small}>{item.provider}</Text>
                            </TextContent>
                          )}
                        </SplitItem>
                      </Split>
                    </DataListCell>,
                  ]}
                />
              </DataListItemRow>
            </DataListItem>
          );
        })}
      </DataList>

      {viewAll?.length > 0 && (
        <div className="ocs-quick-search-list__all-items-link">
          {viewAll.map((catalogLink) => (
            <Link
              id={catalogLink.catalogType}
              to={catalogLink.to}
              key={catalogLink.catalogType}
              style={{ fontSize: 'var(--pf-global--FontSize--sm)' }}
            >
              {catalogLink.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickSearchList;
