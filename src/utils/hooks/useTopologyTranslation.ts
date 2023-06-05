import { getI18n, useTranslation } from 'react-i18next';

/**
 * A Hook for using the i18n translation.
 */
export const useTopologyTranslation = () => useTranslation('plugin__topology-plugin');

/**
 * a function to perform translation to 'plugin__topology-plugin' namespace
 * @param value string to translate
 */
// skipcq: JS-C1002
export const t = (value: string) => getI18n().t(value, { ns: 'plugin__topology-plugin' });
