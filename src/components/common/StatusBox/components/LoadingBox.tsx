import React, { FC } from 'react';
import classNames from 'classnames';

import Box from '../../LoadingInline/components/Box';
import Loading from '../../LoadingInline/components/Loading';

type LoadingBoxProps = {
  className?: string;
  message?: string;
};

const LoadingBox: FC<LoadingBoxProps> = ({ className, message }) => (
  <Box className={classNames('cos-status-box--loading', className)}>
    <Loading />
    {message && <div className="cos-status-box__loading-message">{message}</div>}
  </Box>
);

export default LoadingBox;
