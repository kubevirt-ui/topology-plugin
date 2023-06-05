import React, { SFC } from 'react';
import { Link } from 'react-router-dom';

import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

export type BreadCrumbsProps = {
  breadcrumbs: { name: string; path: string }[];
};

const BreadCrumbs: SFC<BreadCrumbsProps> = ({ breadcrumbs }) => (
  <Breadcrumb className="co-breadcrumb">
    {breadcrumbs.map((crumb, i, { length }) => {
      const isLast = i === length - 1;

      return (
        <BreadcrumbItem key={i} isActive={isLast}>
          {isLast ? (
            crumb.name
          ) : (
            <Link
              className="pf-c-breadcrumb__link"
              to={crumb.path}
              data-test-id={`breadcrumb-link-${i}`}
            >
              {crumb.name}
            </Link>
          )}
        </BreadcrumbItem>
      );
    })}
  </Breadcrumb>
);

export default BreadCrumbs;
