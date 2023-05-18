import React, { FC, ReactNode } from 'react';

import Box from './Box';

type MsgBoxProps = {
  title?: string;
  detail?: ReactNode;
  className?: string;
};

const MsgBox: FC<MsgBoxProps> = ({ title, detail, className = '' }) => (
  <Box className={className}>
    {title && (
      <div className="cos-status-box__title" data-test="msg-box-title">
        {title}
      </div>
    )}
    {detail && (
      <div className="pf-u-text-align-center cos-status-box__detail" data-test="msg-box-detail">
        {detail}
      </div>
    )}
  </Box>
);

export default MsgBox;
