import { K8sKind } from '@openshift-console/dynamic-plugin-sdk';
import { chart_color_cyan_400 as knativeServingColor } from '@patternfly/react-tokens/dist/js/chart_color_cyan_400';
import { chart_color_red_300 as knativeEventingColor } from '@patternfly/react-tokens/dist/js/chart_color_red_300';
import { t } from '@topology-utils/hooks/useTopologyTranslation';

import {
  CAMEL_APIGROUP,
  KNATIVE_EVENT_MESSAGE_APIGROUP,
  KNATIVE_EVENTING_APIGROUP,
  KNATIVE_SERVING_APIGROUP,
  STRIMZI_KAFKA_APIGROUP,
} from './knative/knative-const';

const apiVersion = 'v1';

export const ConfigurationModel: K8sKind = {
  apiGroup: KNATIVE_SERVING_APIGROUP,
  apiVersion,
  kind: 'Configuration',
  plural: 'configurations',
  label: 'Configuration',
  labelKey: t('Configuration'),
  labelPlural: 'Configurations',
  labelPluralKey: t('Configurations'),
  id: 'configuration',
  abbr: 'CFG',
  namespaced: true,
  crd: true,
  color: knativeServingColor.value,
};

export const KnativeServingModel: K8sKind = {
  apiGroup: 'operator.knative.dev',
  apiVersion: 'v1alpha1',
  kind: 'KnativeServing',
  label: 'KnativeServing',
  labelKey: t('KnativeServing'),
  labelPlural: 'KnativeServings',
  labelPluralKey: t('KnativeServings'),
  plural: 'knativeservings',
  id: 'knativeserving',
  abbr: 'KS',
  namespaced: true,
  crd: true,
  color: knativeServingColor.value,
};

export const RevisionModel: K8sKind = {
  apiGroup: KNATIVE_SERVING_APIGROUP,
  apiVersion,
  kind: 'Revision',
  label: 'Revision',
  labelKey: t('Revision'),
  labelPluralKey: t('Revisions'),
  labelPlural: 'Revisions',
  plural: 'revisions',
  id: 'revision',
  abbr: 'REV',
  namespaced: true,
  crd: true,
  color: knativeServingColor.value,
};

export const RouteModel: K8sKind = {
  apiGroup: KNATIVE_SERVING_APIGROUP,
  apiVersion,
  kind: 'Route',
  label: 'Route',
  labelKey: t('Route'),
  labelPlural: 'Routes',
  labelPluralKey: t('Routes'),
  plural: 'routes',
  id: 'route',
  abbr: 'RT',
  namespaced: true,
  crd: true,
  color: knativeServingColor.value,
};

export const ServiceModel: K8sKind = {
  apiGroup: KNATIVE_SERVING_APIGROUP,
  apiVersion,
  kind: 'Service',
  label: 'Service',
  labelKey: t('Service'),
  labelPluralKey: t('Services'),
  labelPlural: 'Services',
  plural: 'services',
  id: 'service',
  abbr: 'KSVC',
  namespaced: true,
  crd: true,
  color: knativeServingColor.value,
};

export const DomainMappingModel: K8sKind = {
  apiGroup: KNATIVE_SERVING_APIGROUP,
  apiVersion: 'v1alpha1',
  kind: 'DomainMapping',
  label: 'DomainMapping',
  labelKey: t('DomainMapping'),
  labelPlural: 'DomainMappings',
  labelPluralKey: t('DomainMappings'),
  plural: 'domainmappings',
  id: 'DomainMapping',
  abbr: 'DM',
  namespaced: true,
  crd: true,
  color: knativeServingColor.value,
};

export const EventingSubscriptionModel: K8sKind = {
  apiGroup: KNATIVE_EVENT_MESSAGE_APIGROUP,
  apiVersion,
  kind: 'Subscription',
  label: 'Subscription',
  labelKey: t('Subscription'),
  labelPlural: 'Subscriptions',
  labelPluralKey: t('Subscriptions'),
  plural: 'subscriptions',
  id: 'subscriptioneventing',
  abbr: 'S',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const EventingBrokerModel: K8sKind = {
  apiGroup: KNATIVE_EVENTING_APIGROUP,
  apiVersion,
  kind: 'Broker',
  label: 'Broker',
  labelKey: t('Broker'),
  labelPlural: 'Brokers',
  labelPluralKey: t('Brokers'),
  plural: 'brokers',
  id: 'broker',
  abbr: 'B',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const EventingTriggerModel: K8sKind = {
  apiGroup: KNATIVE_EVENTING_APIGROUP,
  apiVersion,
  kind: 'Trigger',
  label: 'Trigger',
  labelKey: t('Trigger'),
  labelPlural: 'Triggers',
  labelPluralKey: t('Triggers'),
  plural: 'triggers',
  id: 'trigger',
  abbr: 'T',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const CamelIntegrationModel: K8sKind = {
  apiGroup: CAMEL_APIGROUP,
  apiVersion,
  kind: 'Integration',
  label: 'Integration',
  labelKey: t('Integration'),
  labelPlural: 'Integrations',
  labelPluralKey: t('Integrations'),
  plural: 'integrations',
  id: 'integration',
  abbr: 'I',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const KafkaModel: K8sKind = {
  apiGroup: STRIMZI_KAFKA_APIGROUP,
  apiVersion: 'v1beta2',
  kind: 'Kafka',
  label: 'Kafka',
  labelKey: t('Kafka'),
  labelPlural: 'Kafkas',
  labelPluralKey: t('Kafkas'),
  plural: 'kafkas',
  id: 'kafka',
  abbr: 'K',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const KafkaTopicModel: K8sKind = {
  apiGroup: STRIMZI_KAFKA_APIGROUP,
  apiVersion: 'v1beta2',
  kind: 'KafkaTopic',
  label: 'KafkaTopic',
  labelKey: t('KafkaTopic'),
  labelPlural: 'KafkaTopics',
  labelPluralKey: t('KafkaTopics'),
  plural: 'kafkatopics',
  id: 'kafkatopic',
  abbr: 'KT',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const CamelKameletBindingModel: K8sKind = {
  apiGroup: CAMEL_APIGROUP,
  apiVersion: 'v1alpha1',
  kind: 'KameletBinding',
  label: 'KameletBinding',
  labelKey: t('KameletBinding'),
  labelPlural: 'KameletBindings',
  labelPluralKey: t('KameletBindings'),
  plural: 'kameletbindings',
  id: 'kameletbinding',
  abbr: 'KB',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const CamelKameletModel: K8sKind = {
  apiGroup: CAMEL_APIGROUP,
  apiVersion: 'v1alpha1',
  kind: 'Kamelet',
  label: 'Kamelet',
  labelKey: t('Kamelet'),
  labelPlural: 'Kamelets',
  labelPluralKey: t('Kamelets'),
  plural: 'kamelets',
  id: 'kamelet',
  abbr: 'K',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const KafkaSinkModel: K8sKind = {
  apiGroup: 'eventing.knative.dev',
  apiVersion: 'v1alpha1',
  kind: 'KafkaSink',
  label: 'KafkaSink',
  labelKey: t('KafkaSink'),
  labelPlural: 'KafkaSinks',
  labelPluralKey: t('KafkaSinks'),
  plural: 'kafkasinks',
  id: 'kafkasink',
  abbr: 'KS',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};
