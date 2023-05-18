import { useCallback, useMemo } from 'react';
import castArray from 'lodash.castarray';

import {
  CatalogItemFilter,
  CatalogItemMetadataProvider,
  CatalogItemProvider,
  CatalogItemType,
  CatalogItemTypeMetadata,
  isCatalogItemFilter,
  isCatalogItemMetadataProvider,
  isCatalogItemProvider,
  isCatalogItemType,
  isCatalogItemTypeMetadata,
  ResolvedExtension,
  useResolvedExtensions,
} from '@openshift-console/dynamic-plugin-sdk';

const useCatalogExtensions = (
  catalogId: string,
  catalogType?: string,
): [
  ResolvedExtension<CatalogItemType>[],
  ResolvedExtension<CatalogItemProvider>[],
  ResolvedExtension<CatalogItemFilter>[],
  ResolvedExtension<CatalogItemMetadataProvider>[],
  boolean,
] => {
  const [itemTypeExtensions, itemTypesResolved] = useResolvedExtensions<CatalogItemType>(
    useCallback(
      (e): e is CatalogItemType =>
        isCatalogItemType(e) && (!catalogType || e.properties.type === catalogType),
      [catalogType],
    ),
  );

  const [typeMetadataExtensions, itemTypeMetadataResolved] =
    useResolvedExtensions<CatalogItemTypeMetadata>(
      useCallback(
        (e): e is CatalogItemTypeMetadata =>
          isCatalogItemTypeMetadata(e) && (!catalogType || e.properties.type === catalogType),
        [catalogType],
      ),
    );

  const [catalogProviderExtensions, providersResolved] = useResolvedExtensions<CatalogItemProvider>(
    useCallback(
      (e): e is CatalogItemProvider =>
        isCatalogItemProvider(e) &&
        castArray(e.properties.catalogId).includes(catalogId) &&
        (!catalogType || e.properties.type === catalogType),
      [catalogId, catalogType],
    ),
  );

  const [itemFilterExtensions, filtersResolved] = useResolvedExtensions<CatalogItemFilter>(
    useCallback(
      (e): e is CatalogItemFilter =>
        isCatalogItemFilter(e) &&
        castArray(e.properties.catalogId).includes(catalogId) &&
        (!catalogType || e.properties.type === catalogType),
      [catalogId, catalogType],
    ),
  );

  const [metadataProviderExtensions, metadataProvidersResolved] =
    useResolvedExtensions<CatalogItemMetadataProvider>(
      useCallback(
        (e): e is CatalogItemMetadataProvider =>
          isCatalogItemMetadataProvider(e) &&
          castArray(e.properties.catalogId).includes(catalogId) &&
          (!catalogType || e.properties.type === catalogType),
        [catalogId, catalogType],
      ),
    );

  const catalogTypeExtensions = useMemo<ResolvedExtension<CatalogItemType>[]>(
    () =>
      (catalogType
        ? itemTypeExtensions.filter((e) => e.properties.type === catalogType)
        : itemTypeExtensions
      ).map((e) => {
        const metadataExts = typeMetadataExtensions.filter(
          (em) => e.properties.type === em.properties.type,
        );
        if (metadataExts.length > 0) {
          return Object.assign({}, e, {
            properties: {
              ...e.properties,
              filters: [
                ...(e.properties.filters ?? []),
                ...metadataExts
                  .map((em) => em.properties.filters)
                  .filter((x) => x)
                  .flat(),
              ],
              groupings: [
                ...(e.properties.groupings ?? []),
                ...metadataExts
                  .map((em) => em.properties.groupings)
                  .filter((x) => x)
                  .flat(),
              ],
            },
          });
        }
        return e;
      }),
    [catalogType, itemTypeExtensions, typeMetadataExtensions],
  );

  catalogProviderExtensions.sort((a, b) => {
    const p1 = a.properties.priority ?? 0;
    const p2 = b.properties.priority ?? 0;
    return p1 - p2;
  });

  const catalogFilterExtensions = catalogType
    ? itemFilterExtensions.filter((e) => e.properties.type === catalogType)
    : itemFilterExtensions;

  const catalogMetadataProviderExtensions = catalogType
    ? metadataProviderExtensions.filter((e) => e.properties.type === catalogType)
    : metadataProviderExtensions;

  return [
    catalogTypeExtensions,
    catalogProviderExtensions,
    catalogFilterExtensions,
    catalogMetadataProviderExtensions,
    providersResolved &&
      filtersResolved &&
      itemTypesResolved &&
      itemTypeMetadataResolved &&
      metadataProvidersResolved,
  ];
};

export default useCatalogExtensions;
