import { ONE_HOUR } from '@topology-utils/time-constants';

export const PROMETHEUS_BASE_PATH = (window as any).SERVER_FLAGS.prometheusBaseURL;
export const PROMETHEUS_TENANCY_BASE_PATH = (window as any).SERVER_FLAGS.prometheusTenancyBaseURL;
export const DEFAULT_PROMETHEUS_SAMPLES = 60;
export const DEFAULT_PROMETHEUS_TIMESPAN = ONE_HOUR;
