import React from 'react';
import { Trans } from 'react-i18next';

import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import { BuildPhase } from '../utils/types';

import BuildNumberLink from './BuildNumberLink';

const StatusTitle = ({ build }: { build: K8sResourceKind }) => {
  const { t } = useTopologyTranslation();
  switch (build.status.phase) {
    case BuildPhase.Cancelled:
      return (
        <Trans t={t} ns="plugin__topology-plugin">
          Build <BuildNumberLink build={build} /> was cancelled
        </Trans>
      );
    case BuildPhase.Complete:
      return (
        <Trans t={t} ns="plugin__topology-plugin">
          Build <BuildNumberLink build={build} /> was complete
        </Trans>
      );
    case BuildPhase.Error:
      return (
        <Trans t={t} ns="plugin__topology-plugin">
          Build <BuildNumberLink build={build} /> encountered an error
        </Trans>
      );
    case BuildPhase.Failed:
      return (
        <Trans t={t} ns="plugin__topology-plugin">
          Build <BuildNumberLink build={build} /> failed
        </Trans>
      );
    case BuildPhase.New:
      return (
        <Trans t={t} ns="plugin__topology-plugin">
          Build <BuildNumberLink build={build} /> is new
        </Trans>
      );
    case BuildPhase.Pending:
      return (
        <Trans t={t} ns="plugin__topology-plugin">
          Build <BuildNumberLink build={build} /> is pending
        </Trans>
      );
    case BuildPhase.Running:
      return (
        <Trans t={t} ns="plugin__topology-plugin">
          Build <BuildNumberLink build={build} /> is running
        </Trans>
      );
    default:
      return (
        <Trans t={t} ns="plugin__topology-plugin">
          Build <BuildNumberLink build={build} /> is {build.status?.phase?.toLowerCase()}
        </Trans>
      );
  }
};

export default StatusTitle;
