import React, { FC } from 'react';

import { Alert } from '@patternfly/react-core';

type SuccessMessageProps = {
  message: any;
};

const SuccessMessage: FC<SuccessMessageProps> = ({ message }) => (
  <Alert isInline className="co-alert" variant="success" title={message} />
);

export default SuccessMessage;
