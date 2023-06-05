import React, { FC } from 'react';

import { useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk-internal';
import { LazySubTitleRender, ProjectListPageProps } from '@topology-utils/types/dev-console-types';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import ProjectListPage from './ProjectListPage';

export interface CreateProjectListPageProps extends ProjectListPageProps {
  title: string;
  children: LazySubTitleRender;
  onCreate?: (project: K8sResourceKind) => void;
}

const CreateProjectListPage: FC<CreateProjectListPageProps> = ({
  onCreate,
  title,
  children,
  ...props
}) => {
  const [, setActiveNamespace] = useActiveNamespace();
  const handleSubmit = (project: K8sResourceKind) => {
    setActiveNamespace(project.metadata?.name);
    onCreate && onCreate(project);
  };
  const openProjectModal = () => createProjectModal({ blocking: true, onSubmit: handleSubmit });
  return (
    <ProjectListPage {...props} title={title}>
      {children(openProjectModal)}
    </ProjectListPage>
  );
};

export default CreateProjectListPage;
