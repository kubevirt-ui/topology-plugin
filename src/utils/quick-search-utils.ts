import { SyntheticEvent } from 'react';

import { CatalogItem } from '@openshift-console/dynamic-plugin-sdk';
import { keywordCompare } from '@topology-utils/catalog-utils';
import { removeQueryArgument } from '@topology-utils/common-utils';

export const handleCta = async (
  e: SyntheticEvent,
  item: CatalogItem,
  closeModal: () => void,
  fireTelemetryEvent: (event: string, properties?: {}) => void, // eslint-disable-line @typescript-eslint/ban-types
  callbackProps: { [key: string]: string } = {},
) => {
  e.preventDefault();
  const { href, callback } = item.cta;
  if (callback) {
    fireTelemetryEvent('Quick Search Used', {
      id: item.uid,
      type: item.type,
      name: item.name,
    });
    closeModal();
    await callback(callbackProps);
    removeQueryArgument('catalogSearch');
  } else history.push(href);
};

export const quickSearch = (items: CatalogItem[], query: string) => {
  return keywordCompare(query, items);
};
