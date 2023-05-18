import React, { FC } from 'react';

import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import { BuildPhase } from '../utils/types';

import LogSnippet from './LogSnippet';

type BuildStatusProps = {
  build: K8sResourceKind;
};

const BuildStatus: FC<BuildStatusProps> = ({ build }) => {
  const {
    status: { logSnippet, message, phase },
  } = build;
  const unsuccessful = [BuildPhase.Error, BuildPhase.Failed].includes(phase);
  return unsuccessful ? <LogSnippet message={message} logSnippet={logSnippet} /> : null;
};

export default BuildStatus;
