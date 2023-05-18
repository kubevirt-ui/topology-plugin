import i18next from 'i18next';
import * as yup from 'yup';

import { convertToBaseValue } from '@topology-utils/humanize';

export const limitsValidationSchema = () =>
  yup.object().shape({
    cpu: yup.object().shape({
      request: yup
        .number()
        .transform((request) => (isNaN(request) ? undefined : request))
        .min(0, i18next.t('plugin__topology-plugin~Request must be greater than or equal to 0.'))
        .test({
          test(request) {
            const { requestUnit, limit, limitUnit } = this.parent;
            if (limit !== undefined) {
              return (
                convertToBaseValue(`${request}${requestUnit}`) <=
                convertToBaseValue(`${limit}${limitUnit}`)
              );
            }
            return true;
          },
          message: i18next.t(
            'plugin__topology-plugin~CPU request must be less than or equal to limit.',
          ),
        }),
      requestUnit: yup
        .string(i18next.t('plugin__topology-plugin~Unit must be millicores or cores.'))
        .ensure(),
      limitUnit: yup
        .string(i18next.t('plugin__topology-plugin~Unit must be millicores or cores.'))
        .ensure(),
      limit: yup
        .number()
        .transform((limit) => (isNaN(limit) ? undefined : limit))
        .min(0, i18next.t('plugin__topology-plugin~Limit must be greater than or equal to 0.'))
        .test({
          test(limit) {
            const { request, requestUnit, limitUnit } = this.parent;
            if (limit !== undefined) {
              return (
                convertToBaseValue(`${limit}${limitUnit}`) >=
                convertToBaseValue(`${request}${requestUnit}`)
              );
            }
            return true;
          },
          message: i18next.t(
            'plugin__topology-plugin~CPU limit must be greater than or equal to request.',
          ),
        }),
    }),
    memory: yup.object().shape({
      request: yup
        .number()
        .transform((request) => (isNaN(request) ? undefined : request))
        .min(0, i18next.t('plugin__topology-plugin~Request must be greater than or equal to 0.'))
        .test({
          test(request) {
            const { requestUnit, limit, limitUnit } = this.parent;
            if (limit !== undefined) {
              return (
                convertToBaseValue(`${request}${requestUnit}`) <=
                convertToBaseValue(`${limit}${limitUnit}`)
              );
            }
            return true;
          },
          message: i18next.t(
            'plugin__topology-plugin~Memory request must be less than or equal to limit.',
          ),
        }),
      requestUnit: yup.string(i18next.t('plugin__topology-plugin~Unit must be Mi or Gi.')),
      limit: yup
        .number()
        .transform((limit) => (isNaN(limit) ? undefined : limit))
        .min(0, i18next.t('plugin__topology-plugin~Limit must be greater than or equal to 0.'))
        .test({
          test(limit) {
            const { request, requestUnit, limitUnit } = this.parent;
            if (limit !== undefined) {
              return (
                convertToBaseValue(`${request}${requestUnit}`) <=
                convertToBaseValue(`${limit}${limitUnit}`)
              );
            }
            return true;
          },
          message: i18next.t(
            'plugin__topology-plugin~Memory limit must be greater than or equal to request.',
          ),
        }),
      limitUnit: yup.string(i18next.t('plugin__topology-plugin~Unit must be Mi or Gi.')),
    }),
  });
