import { ComponentType, ReactNode } from 'react';

export type LazySubTitleRender = (openProjectModal: () => void) => ReactNode;

export type ProjectListPageProps = {
  title: string;
  listComponent?: ComponentType<any>;
  children?: ReactNode;
  badge?: ReactNode;
};
