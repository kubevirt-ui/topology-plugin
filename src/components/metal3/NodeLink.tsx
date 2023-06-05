import React, { FC } from 'react';

import { ResourceLink, useFlag } from '@openshift-console/dynamic-plugin-sdk';
import { DASH } from '@openshift-console/dynamic-plugin-sdk/lib/app/constants';

import { CAN_LIST_NODE_FLAG } from '../../const';

type NodeLinkProps = {
  name?: string;
};

const NodeLink: FC<NodeLinkProps> = ({ name }) => {
  const canListNode = useFlag(CAN_LIST_NODE_FLAG);
  if (!name) {
    return <>{DASH}</>;
  }

  return canListNode ? (
    <ResourceLink kind="Node" name={name} title={name} />
  ) : (
    <span className="co-break-word">{name}</span>
  );
};

export default NodeLink;
