import { ReactNode } from 'react';

import {
  CatalogItem,
  CatalogItemType,
  ResolvedExtension,
} from '@openshift-console/dynamic-plugin-sdk';
import { CatalogType } from '@topology-utils/types/catalog-types';

export type QuickSearchProvider = {
  catalogType: string;
  items: CatalogItem[];
  loaded: boolean;
  getCatalogURL: (searchTerm: string, ns?: string) => string;
  catalogLinkLabel: string;
  extensions: ResolvedExtension<CatalogItemType>[];
};

export type QuickSearchProviders = QuickSearchProvider[];

export type CatalogLinkData = {
  label: string;
  to: string;
  catalogType: string;
};

export type QuickSearchData = {
  filteredItems: CatalogItem[];
  viewAllLinks: CatalogLinkData[];
  catalogItemTypes: CatalogType[];
};

export type QuickSearchDetailsRendererProps = {
  selectedItem: CatalogItem;
  closeModal: () => void;
};

export type DetailsRendererFunction = (props: QuickSearchDetailsRendererProps) => ReactNode;
