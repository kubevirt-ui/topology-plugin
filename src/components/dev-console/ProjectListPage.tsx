import React, { ComponentType, FC, ReactNode } from 'react';

import { Divider } from '@patternfly/react-core';

import PageHeading from '../common/PageHeading/PageHeading';

export type ProjectListPageProps = {
  title: string;
  listComponent?: ComponentType<any>;
  children?: ReactNode;
  badge?: ReactNode;
};
const ProjectListPage: FC<ProjectListPageProps> = ({
  badge,
  title,
  children,
  listComponent,
  ...listPageProps
}) => (
  <div className="odc-project-list-page">
    <PageHeading title={title} badge={badge}>
      {children}
    </PageHeading>
    <Divider className="co-divider" />
    <ListPage
      {...listPageProps}
      showTitle={false}
      kind="Project"
      ListComponent={listComponent || ProjectsTable}
      canCreate={false}
      filterLabel="by name or display name"
      textFilter="project-name"
    />
  </div>
);

export default ProjectListPage;
