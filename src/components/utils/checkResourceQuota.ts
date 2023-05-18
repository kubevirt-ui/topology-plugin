import { ResourceQuotaModel } from '@kubevirt-ui/kubevirt-api/console';
import { convertToBaseValue } from '@topology-utils/humanize';

export const getUsedPercentage = (hard: string, used: string) => {
  let usedNum = convertToBaseValue(used);
  let hardNum = convertToBaseValue(hard);

  if (!usedNum || !hardNum) {
    // try to get the value without unit
    usedNum = parseInt(usedNum, 10);
    hardNum = parseInt(hardNum, 10);
  }

  return !usedNum || !hardNum ? 0 : (usedNum / hardNum) * 100;
};

type ResourceQuotaReturnItems = [number[], string, string];

export const checkQuotaLimit = (resourceQuotas: any): ResourceQuotaReturnItems => {
  let quotaName = '';
  let quotaKind = '';
  const resourceQuotaResources = resourceQuotas.map((quota) => {
    let resourcesAtQuota;
    if (quota?.kind === ResourceQuotaModel.kind) {
      resourcesAtQuota = Object.keys(quota?.status?.hard || {}).reduce(
        (acc, resource) =>
          getUsedPercentage(quota?.status?.hard[resource], quota?.status?.used?.[resource]) >= 100
            ? acc + 1
            : acc,
        0,
      );
    } else {
      resourcesAtQuota = Object.keys(quota?.status?.total?.hard || {}).reduce(
        (acc, resource) =>
          getUsedPercentage(
            quota?.status?.total?.hard[resource],
            quota?.status?.total?.used?.[resource],
          ) >= 100
            ? acc + 1
            : acc,
        0,
      );
    }

    if (resourcesAtQuota > 0) {
      quotaName = quota.metadata.name;
      quotaKind = quota.kind;
    }
    return resourcesAtQuota;
  });
  return [resourceQuotaResources, quotaName, quotaKind];
};
