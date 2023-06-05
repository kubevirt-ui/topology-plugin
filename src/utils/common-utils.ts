import { MouseEvent } from 'react';
import * as fuzzy from 'fuzzysearch';
import get from 'lodash.get';
import startCase from 'lodash.startcase';

import { K8sKind, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import {
  requirementToString,
  toRequirements,
} from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { t } from '@topology-utils/hooks/useTopologyTranslation';

import { LAST_LANGUAGE_LOCAL_STORAGE_KEY } from '../const';

export const flags = () => (window as any).SERVER_FLAGS;

export const getLastLanguage = (): string => localStorage.getItem(LAST_LANGUAGE_LOCAL_STORAGE_KEY);

export const isEmpty = (obj) =>
  [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;

export const isNil = (val) => val == null;

export const has = (object, key) => {
  const keyParts = key.split('.');

  return (
    !!object &&
    (keyParts.length > 1
      ? has(object[key.split('.')[0]], keyParts.slice(1).join('.'))
      : Object.prototype.hasOwnProperty.call(object, key))
  );
};

export const size = (obj: { [key: string]: any }) => Object.keys(obj).length;

export const sumBy = (arr, func) => arr?.reduce((acc, item) => acc + func(item), 0);

export const pullAt = (arr, indices) =>
  indices
    .reverse()
    .map((idx) => arr.splice(idx, 1)[0])
    .reverse();

export const remove = (array, iteratee) => {
  // in order to not mutate the original array until the very end
  // we want to cache the indexes to remove while preparing the result to return
  const toRemove = [];
  const result = array.filter((item, i) => iteratee(item) && toRemove.push(i));

  // just before returning, we can then remove the items, making sure we start
  // from the higher indexes: otherwise they would shift at each removal
  toRemove.reverse().forEach((i) => array.splice(i, 1));
  return result;
};

export const bind = (fn, ctx, ...boundArgs) => fn.bind(ctx, ...boundArgs);

export const minBy = (arr, func) => {
  const min = Math.min(...arr.map(func));
  return arr.find((item) => func(item) === min);
};

export const maxBy = (arr, func) => {
  const max = Math.max(...arr.map(func));
  return arr.find((item) => func(item) === max);
};

export const take = (arr, qty = 1) => [...arr].splice(0, qty);

export const upperFirst = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

export const uniq = (array: any[]) => [...new Set(array)];

export const toLower = (str) => str.toLowerCase();

export const isString = (a) => a && typeof a === 'string';

const abbrBlacklist = ['ASS'];
export const kindToAbbr = (kind) => {
  const abbrKind = (kind.replace(/[^A-Z]/g, '') || kind.toUpperCase()).slice(0, 4);
  return abbrBlacklist.includes(abbrKind) ? abbrKind.slice(0, -1) : abbrKind;
};

export const getPluralLabel = (kind: string, plural: string) => kind + plural.slice(kind.length);

export const getFieldId = (fieldName: string, fieldType: string) => {
  return `form-${fieldType}-${fieldName?.replace(/\./g, '-')}-field`;
};

const translationForResourceKind = {
  HelmRelease: t('Helm Release'),
};

export const labelKeyForNodeKind = (kindString: string) => {
  const model: K8sKind | undefined = getK8sModel(kindString);
  if (model) {
    if (model.labelKey) {
      return t(model.labelKey);
    }
    return model.label;
  }
  if (translationForResourceKind[kindString]) {
    return t(translationForResourceKind[kindString]);
  }
  return startCase(kindString);
};

// Check for a modified mouse event. For example - Ctrl + Click
export const isModifiedEvent = (event: MouseEvent<HTMLElement>) => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};

export const getQueryArgument = (arg: string) =>
  new URLSearchParams((window as any).location.search).get(arg);

export const isValidUrl = (url: string): boolean => {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const removeQueryArgument = (k: string) => {
  const params = new URLSearchParams(window.location.search);
  if (params.has(k)) {
    params.delete(k);
    const url = new URL(window.location.href);
    history.replace(`${url.pathname}?${params.toString()}${url.hash}`);
  }
};

export const setQueryArgument = (k: string, v: string) => {
  const params = new URLSearchParams(window.location.search);
  if (params.get(k) !== v) {
    params.set(k, v);
    const url = new URL(window.location.href);
    history.replace(`${url.pathname}?${params.toString()}${url.hash}`);
  }
};

export const getName = <A extends K8sResourceCommon = K8sResourceCommon>(value: A) =>
  value?.metadata?.name;

export const getNamespace = <A extends K8sResourceCommon = K8sResourceCommon>(value: A) =>
  value?.metadata?.namespace;

export const getUID = <A extends K8sResourceCommon = K8sResourceCommon>(value: A) =>
  get(value, 'metadata.uid') as K8sResourceCommon['metadata']['uid'];

export const getOwnerReferences = <A extends K8sResourceCommon = K8sResourceCommon>(value: A) =>
  get(value, 'metadata.ownerReferences') as K8sResourceCommon['metadata']['ownerReferences'];

/**
 * function for getting an entity's annotation
 * @param entity - entity to get annotation from
 * @param annotationName - name of the annotation to get
 * @param defaultValue - default value to return if annotation is not found
 * @returns the annotation value or defaultValue if not found
 */
export const getAnnotation = (
  entity: K8sResourceCommon,
  annotationName: string,
  defaultValue?: string,
): string => entity?.metadata?.annotations?.[annotationName] ?? defaultValue;

export const isEqualObject = (object, otherObject) => {
  if (object === otherObject) {
    return true;
  }

  if (object === null || otherObject === null) {
    return false;
  }

  if (object?.constructor !== otherObject?.constructor) {
    return false;
  }

  if (typeof object !== 'object') {
    return false;
  }

  const objectKeys = Object.keys(object);
  const otherObjectKeys = Object.keys(otherObject);

  if (objectKeys.length !== otherObjectKeys.length) {
    return false;
  }

  for (const key of objectKeys) {
    if (!otherObjectKeys.includes(key) || !isEqualObject(object[key], otherObject[key])) {
      return false;
    }
  }

  return true;
};

export const getLabelsAsString = (obj: any, path = 'metadata.labels'): string[] => {
  const labels = get(obj, path);
  const requirements = toRequirements(labels);
  return requirements?.map(requirementToString);
};

export const fuzzyCaseInsensitive = (a: string, b: string): boolean =>
  fuzzy(toLower(a), toLower(b));

export const keywordFilter = <T>(
  filterText: string,
  items: T[],
  compareFunction: (keyword: string, item: T) => boolean,
): T[] => {
  if (!filterText) {
    return items;
  }
  const keywords = uniq(filterText.match(/\S+/g)).map((w) => w.toLowerCase());

  // Sort the longest keyword fist
  keywords.sort(function (a: string, b: string) {
    return b.length - a.length;
  });

  return items.filter((item) => {
    return keywords.every((keyword) => {
      return compareFunction(keyword, item);
    });
  });
};
