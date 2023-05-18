import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';

type BoxProps = {
  children: ReactNode;
  className?: string;
};

const Box: FC<BoxProps> = ({ children, className }) => (
  <div className={classNames('cos-status-box', className)}>{children}</div>
);

export default Box;
