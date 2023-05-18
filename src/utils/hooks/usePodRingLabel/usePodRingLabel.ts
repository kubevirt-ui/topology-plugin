import { useMemo } from 'react';

import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import { HorizontalPodAutoscalerKind } from '../../types/hpaTypes';
import { ExtPodKind } from '../../types/podTypes';

import { PodRingLabelType } from './utils/types';
import { getTitleComponent, hpaPodRingLabel, podRingLabel } from './utils/utils';

const usePodRingLabel = (
  obj: K8sResourceKind,
  ownerKind: string,
  pods: ExtPodKind[],
  hpaControlledScaling = false,
  hpa?: HorizontalPodAutoscalerKind,
): PodRingLabelType => {
  const { t } = useTopologyTranslation();
  const podRingLabelData = hpaControlledScaling
    ? hpaPodRingLabel(obj, hpa, pods, t)
    : podRingLabel(obj, ownerKind, pods, t);
  const { title, subTitle, longTitle, longSubtitle, reversed } = podRingLabelData;

  return useMemo(
    () => ({
      title,
      subTitle,
      titleComponent: getTitleComponent(longTitle, longSubtitle, reversed),
    }),
    [longSubtitle, longTitle, reversed, subTitle, title],
  );
};

export default usePodRingLabel;
