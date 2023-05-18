import {
  CatalogItemType,
  isCatalogItemType,
  useResolvedExtensions,
} from '@openshift-console/dynamic-plugin-sdk';
import { CatalogVisibilityState } from '@topology-utils/types/catalog-types';

const useGetAllDisabledSubCatalogs = () => {
  const [catalogExtensionsArray] = useResolvedExtensions<CatalogItemType>(isCatalogItemType);
  const catalogTypeExtensions = catalogExtensionsArray.map((type) => {
    return type.properties.type;
  });
  let disabledSubCatalogs = [];
  if ((window as any).SERVER_FLAGS.developerCatalogTypes) {
    const developerCatalogTypes = JSON.parse((window as any).SERVER_FLAGS.developerCatalogTypes);
    if (
      developerCatalogTypes?.state === CatalogVisibilityState.Enabled &&
      developerCatalogTypes?.enabled?.length > 0
    ) {
      disabledSubCatalogs = catalogTypeExtensions.filter(
        (val) => !developerCatalogTypes?.enabled.includes(val),
      );
      return [disabledSubCatalogs];
    }
    if (developerCatalogTypes?.state === CatalogVisibilityState.Disabled) {
      if (developerCatalogTypes?.disabled?.length > 0) {
        return [developerCatalogTypes?.disabled, catalogTypeExtensions];
      }
      return [catalogTypeExtensions];
    }
  }
  return [disabledSubCatalogs];
};

export default useGetAllDisabledSubCatalogs;
