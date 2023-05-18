import React, { FC, ReactNode } from 'react';
import Linkify from 'react-linkify';

const LinkifyExternal: FC<{ children: ReactNode }> = ({ children }) => (
  <Linkify properties={{ target: '_blank', rel: 'noopener noreferrer' }}>{children}</Linkify>
);

export default LinkifyExternal;
