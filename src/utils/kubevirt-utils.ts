import { ComponentType } from 'react';

import { getNamespace, getOwnerReferences, getUID } from '@topology-utils/common-utils';
import { VMIKind } from '@topology-utils/types/kubevirtTypes';
import { PodKind } from '@topology-utils/types/podTypes';

import VMListViewNode from '../components/VMListViewNode';
import { TYPE_VIRTUAL_MACHINE } from '../const';

export const kubevirtListViewNodeComponentFactory = (
  type,
):
  | ComponentType<{
      item: Node;
      selectedIds: string[];
      onSelect: (ids: string[]) => void;
    }>
  | undefined => {
  switch (type) {
    case TYPE_VIRTUAL_MACHINE:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return VMListViewNode;
    default:
      return null;
  }
};

const isPodReady = (pod: PodKind): boolean =>
  pod?.status?.phase === 'Running' && pod?.status?.containerStatuses?.every((s) => s.ready);

export const findVMIPod = (vmi?: VMIKind, pods?: PodKind[]) => {
  if (!pods || !vmi) {
    return null;
  }

  const vmUID = getUID(vmi);
  const prefixedPods = pods.filter((p) => {
    const podOwnerReferences = getOwnerReferences(p);
    return (
      getNamespace(p) === getNamespace(vmi) &&
      podOwnerReferences &&
      podOwnerReferences.some((podOwnerReference) => podOwnerReference.uid === vmUID)
    );
  });

  // Return the newest, most ready Pod created
  return prefixedPods
    .sort((a: PodKind, b: PodKind) =>
      a.metadata.creationTimestamp > b.metadata.creationTimestamp ? -1 : 1,
    )
    .sort((a: PodKind) => (isPodReady(a) ? -1 : 1))[0];
};
