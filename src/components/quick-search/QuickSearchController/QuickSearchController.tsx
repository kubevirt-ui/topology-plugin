import React from 'react';

import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { quickSearch } from '@topology-utils/quick-search-utils';
import {
  DetailsRendererFunction,
  QuickSearchData,
  QuickSearchProviders,
} from '@topology-utils/types/quick-search-types';

import QuickSearchModal from '../../modals/QuickSearchModal/QuickSearchModal';

type QuickSearchControllerProps = {
  namespace: string;
  viewContainer?: HTMLElement;
  quickSearchProviders: QuickSearchProviders;
  searchPlaceholder: string;
  allItemsLoaded: boolean;
  isOpen: boolean;
  icon?: React.ReactNode;
  limitItemCount?: number;
  disableKeyboardOpen?: boolean;
  setIsOpen: (isOpen: boolean) => void;
  detailsRenderer?: DetailsRendererFunction;
};

const QuickSearchController: React.FC<QuickSearchControllerProps> = ({
  namespace,
  quickSearchProviders,
  searchPlaceholder,
  viewContainer,
  allItemsLoaded,
  limitItemCount,
  icon,
  isOpen,
  setIsOpen,
  disableKeyboardOpen = false,
  detailsRenderer,
}) => {
  const { t } = useTopologyTranslation();

  const isLimitedList = limitItemCount > 0;
  const searchCatalog = React.useCallback(
    (searchTerm: string): QuickSearchData => {
      return quickSearchProviders.reduce(
        (acc, quickSearchProvider) => {
          const items = quickSearchProvider.loaded
            ? quickSearch(quickSearchProvider.items, searchTerm)
            : [];
          const itemCount = items.length;
          const viewAllLink =
            itemCount > 0 && isLimitedList
              ? [
                  {
                    label: t(quickSearchProvider.catalogLinkLabel, { itemCount }),
                    to: quickSearchProvider.getCatalogURL(searchTerm, namespace),
                    catalogType: quickSearchProvider.catalogType,
                  },
                ]
              : [];
          const catalogItemTypes = quickSearchProvider.extensions.map((extension) => ({
            label: extension.properties.title,
            value: extension.properties.type,
            description: extension.properties.typeDescription,
          }));
          return {
            filteredItems: [...acc.filteredItems, ...items].sort((item1, item2) =>
              item1.name.localeCompare(item2.name),
            ),
            viewAllLinks: [...acc.viewAllLinks, ...viewAllLink],
            catalogItemTypes: [...acc.catalogItemTypes, ...catalogItemTypes],
          };
        },
        { filteredItems: [], viewAllLinks: [], catalogItemTypes: [] },
      );
    },
    [isLimitedList, namespace, quickSearchProviders, t],
  );

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const { nodeName } = e.target as Element;
      if (nodeName === 'INPUT' || nodeName === 'TEXTAREA') {
        return;
      }

      if (!disableKeyboardOpen && e.code === 'Space' && e.ctrlKey) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [setIsOpen, disableKeyboardOpen]);

  return (
    <QuickSearchModal
      limitItemCount={limitItemCount}
      icon={icon}
      isOpen={isOpen}
      closeModal={() => setIsOpen(false)}
      namespace={namespace}
      searchPlaceholder={searchPlaceholder}
      allCatalogItemsLoaded={allItemsLoaded}
      searchCatalog={searchCatalog}
      viewContainer={viewContainer}
      detailsRenderer={detailsRenderer}
    />
  );
};

export default QuickSearchController;
