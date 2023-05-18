import React, { FC, memo } from 'react';

import { QuickStartsLoader } from '@openshift-console/dynamic-plugin-sdk-internal';
import { QuickStart } from '@patternfly/quickstarts';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { CatalogService } from '@topology-utils/types/catalog-types';
import { QuickSearchProviders } from '@topology-utils/types/quick-search-types';

import CatalogServiceProvider from '../common/CatalogServiceProvider';

import QuickSearchController from './QuickSearchController/QuickSearchController';
import { useTransformedQuickStarts } from './topology-quick-search-utils';

interface QuickSearchProps {
  namespace: string;
  viewContainer?: HTMLElement;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Contents: FC<
  {
    quickStarts: QuickStart[];
    quickStartsLoaded: boolean;
    catalogService: CatalogService;
    catalogServiceSample: CatalogService;
  } & QuickSearchProps
> = ({
  quickStarts,
  quickStartsLoaded,
  catalogService,
  catalogServiceSample,
  namespace,
  viewContainer,
  isOpen,
  setIsOpen,
}) => {
  const { t } = useTopologyTranslation();

  const DEFAULT_LIMIT_ITEM_COUNT = 5;
  const quickStartItems = useTransformedQuickStarts(quickStarts);
  const quickSearchProviders: QuickSearchProviders = [
    {
      catalogType: 'devCatalog',
      items: catalogService.items,
      loaded: catalogService.loaded,
      getCatalogURL: (searchTerm: string, ns: string) => `/catalog/ns/${ns}?keyword=${searchTerm}`,
      // t('View all developer catalog items ({{itemCount, number}})')
      catalogLinkLabel: 'View all developer catalog items ({{itemCount, number}})',
      extensions: catalogService.catalogExtensions,
    },
    {
      catalogType: 'quickStarts',
      items: quickStartItems,
      loaded: quickStartsLoaded,
      getCatalogURL: (searchTerm: string) => `/quickstart?keyword=${searchTerm}`,
      // t('View all quick starts ({{itemCount, number}})'
      catalogLinkLabel: 'View all quick starts ({{itemCount, number}})',
      extensions: catalogService.catalogExtensions,
    },
    {
      catalogType: 'Samples',
      items: catalogServiceSample.items,
      loaded: catalogServiceSample.loaded,
      getCatalogURL: (searchTerm: string, ns: string) => `/samples/ns/${ns}?keyword=${searchTerm}`,
      // t('View all samples ({{itemCount, number}})'
      catalogLinkLabel: 'View all samples ({{itemCount, number}})',
      extensions: catalogService.catalogExtensions,
    },
  ];
  return (
    <QuickSearchController
      quickSearchProviders={quickSearchProviders}
      allItemsLoaded={catalogService.loaded && quickStartsLoaded}
      searchPlaceholder={`${t('Add to Project')}...`}
      namespace={namespace}
      viewContainer={viewContainer}
      isOpen={isOpen}
      limitItemCount={DEFAULT_LIMIT_ITEM_COUNT}
      setIsOpen={setIsOpen}
    />
  );
};

const TopologyQuickSearch: FC<QuickSearchProps> = ({
  namespace,
  viewContainer,
  isOpen,
  setIsOpen,
}) => {
  return (
    <CatalogServiceProvider namespace={namespace} catalogId="dev-catalog">
      {(catalogService: CatalogService) => (
        <CatalogServiceProvider namespace={namespace} catalogId="samples-catalog">
          {(catalogServiceSample: CatalogService) => (
            <QuickStartsLoader>
              {(quickStarts, quickStartsLoaded) => (
                <Contents
                  {...{
                    namespace,
                    viewContainer,
                    isOpen,
                    setIsOpen,
                    catalogService,
                    catalogServiceSample,
                    quickStarts,
                    quickStartsLoaded,
                  }}
                />
              )}
            </QuickStartsLoader>
          )}
        </CatalogServiceProvider>
      )}
    </CatalogServiceProvider>
  );
};

export default memo(TopologyQuickSearch);
