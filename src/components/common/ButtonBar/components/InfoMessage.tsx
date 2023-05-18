import React, { FC } from 'react';

import { Alert } from '@patternfly/react-core';

type InfoMessageProps = {
  message: any;
};

const InfoMessage: FC<InfoMessageProps> = ({ message }) => (
  <Alert isInline className="co-alert" variant="info" title={message} />
);

export default InfoMessage;
