import React, { SFC } from 'react';

import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import ExternalLink from '../../../common/ExternalLink';
import { getJenkinsLogURL } from '../utils/utils';

type BuildPipelineLogLinkProps = {
  obj: K8sResourceKind;
};

const BuildPipelineLogLink: SFC<BuildPipelineLogLinkProps> = ({ obj }) => {
  const { t } = useTopologyTranslation();
  const link = getJenkinsLogURL(obj);
  return link ? (
    <ExternalLink
      href={link}
      text={t('public~View logs')}
      additionalClassName="build-pipeline__log-link"
    />
  ) : null;
};

export default BuildPipelineLogLink;
