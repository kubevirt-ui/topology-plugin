import React, { SFC } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { K8sResourceKindReference } from '@openshift-console/dynamic-plugin-sdk';
import { Label as PfLabel } from '@patternfly/react-core';
import { kindForReference } from '@topology-utils/k8s-utils';

export type LabelProps = {
  kind: K8sResourceKindReference;
  name: string;
  value: string;
  expand: boolean;
};

const Label: SFC<LabelProps> = ({ kind, name, value, expand }) => {
  const href = `/search?kind=${kind}&q=${value ? encodeURIComponent(`${name}=${value}`) : name}`;
  const kindOf = `co-m-${kindForReference(kind.toLowerCase())}`;
  const klass = classNames(kindOf, { 'co-m-expand': expand }, 'co-label');

  return (
    <>
      <PfLabel className={klass} isTruncated>
        <Link className="pf-c-label__content" to={href}>
          <span className="co-label__key" data-test="label-key">
            {name}
          </span>
          {value && <span className="co-label__eq">=</span>}
          {value && <span className="co-label__value">{value}</span>}
        </Link>
      </PfLabel>
    </>
  );
};

export default Label;
