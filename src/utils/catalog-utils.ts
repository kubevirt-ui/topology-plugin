import {
  CatalogItem,
  CatalogItemMetadataProviderFunction,
} from '@openshift-console/dynamic-plugin-sdk';
import { keywordFilter } from '@topology-utils/common-utils';

import * as catalogImg from '../../images/logos/catalog-icon.svg';

export const normalizeIconClass = (iconClass: string): string => {
  return iconClass.startsWith('icon-') ? `font-icon ${iconClass}` : iconClass;
};

export const getIconProps = (item: CatalogItem) => {
  const { icon } = item;
  if (icon.url) {
    return { iconImg: icon.url, iconClass: null };
  }
  if (icon.class) {
    return { iconImg: null, iconClass: normalizeIconClass(icon.class) };
  }
  if (icon.node) {
    return { iconImg: null, iconClass: null, icon: icon.node };
  }
  return { iconImg: catalogImg, iconClass: null };
};

const catalogItemCompare = (keyword: string, item: CatalogItem): boolean => {
  if (!item) {
    return false;
  }
  return (
    item.name.toLowerCase().includes(keyword) ||
    (typeof item.description === 'string' && item.description.toLowerCase().includes(keyword)) ||
    item.type.toLowerCase().includes(keyword) ||
    item.tags?.some((tag) => tag.includes(keyword)) ||
    item.cta?.label.toLowerCase().includes(keyword)
  );
};

export const keywordCompare = (filterString: string, items: CatalogItem[]): CatalogItem[] => {
  return keywordFilter(filterString, items, catalogItemCompare);
};

export const applyCatalogItemMetadata = (
  catalogItems: CatalogItem[],
  metadataProviderMap: {
    [type: string]: { [id: string]: CatalogItemMetadataProviderFunction };
  },
) =>
  catalogItems.map((item) => {
    const metadataProviders = Object.values(metadataProviderMap[item.type] ?? {});
    if (metadataProviders?.length) {
      const metadata = metadataProviders
        .map((metadataProvider) => metadataProvider(item))
        .filter((x) => x);

      const tags = metadata
        .map((m) => m.tags)
        .filter((x) => x)
        .flat();
      const badges = metadata
        .map((m) => m.badges)
        .filter((x) => x)
        .flat();
      const attributes = metadata.reduce(
        (acc, m) => Object.assign(acc, m.attributes),
        {} as CatalogItem['attributes'],
      );
      const attributeCount = Object.keys(attributes).length;
      if (tags.length > 0 || badges.length > 0 || attributeCount > 0) {
        return {
          ...item,
          tags: tags.length > 0 ? [...(item.tags ?? []), ...tags] : item.tags,
          badges: badges.length > 0 ? [...(item.badges ?? []), ...badges] : item.badges,
          attributes: attributeCount ? { ...item.attributes, ...attributes } : item.attributes,
        };
      }
    }
    return item;
  });
