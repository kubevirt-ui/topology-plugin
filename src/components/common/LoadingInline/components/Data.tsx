import React, { ComponentType, FC, ReactNode } from 'react';

import { isEmpty } from '@topology-utils/common-utils';

import EmptyBox from './EmptyBox';

type DataProps = {
  NoDataEmptyMsg?: ComponentType;
  EmptyMsg?: ComponentType;
  label?: string;
  unfilteredData?: any;
  data?: any;
  children?: ReactNode;
};

const Data: FC<DataProps> = ({
  NoDataEmptyMsg,
  EmptyMsg,
  label,
  data,
  unfilteredData,
  children,
}) => {
  if (NoDataEmptyMsg && isEmpty(unfilteredData)) {
    return (
      <div className="loading-box loading-box__loaded">
        {NoDataEmptyMsg ? <NoDataEmptyMsg /> : <EmptyBox label={label} />}
      </div>
    );
  }

  if (!data || isEmpty(data)) {
    return (
      <div className="loading-box loading-box__loaded">
        {EmptyMsg ? <EmptyMsg /> : <EmptyBox label={label} />}
      </div>
    );
  }
  return <div className="loading-box loading-box__loaded">{children}</div>;
};

export default Data;
