import React, { FC } from 'react';

import './TopologySideBarTabSection.scss';

const TopologySideBarTabSection: FC = ({ children }) => {
  return <div className="ocs-sidebar-tabsection">{children}</div>;
};

export default TopologySideBarTabSection;
