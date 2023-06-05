import React, { Fragment } from 'react';

import {
  Action,
  GroupedMenuOption,
  MenuOption,
  MenuOptionType,
} from '@openshift-console/dynamic-plugin-sdk';
import { ContextMenuItem, ContextSubMenuItem, Graph, Node } from '@patternfly/react-topology';

import ActionMenuItem from '../components/ActionMenu/components/ActionMenuContent/components/ActionMenuItem/ActionMenuItem';
import {
  getMenuOptionType,
  orderExtensionBasedOnInsertBeforeAndAfter,
} from '../components/ActionMenu/components/ActionMenuContent/utils/utils';
import { getResource } from '../utils';
import { getReferenceForResource } from '../utils/k8s-utils';

export const createContextMenuItems = (actions: MenuOption[]) => {
  const sortedOptions = orderExtensionBasedOnInsertBeforeAndAfter(actions);
  return sortedOptions.map((option: MenuOption) => {
    const optionType = getMenuOptionType(option);
    switch (optionType) {
      case MenuOptionType.SUB_MENU:
        return (
          <ContextSubMenuItem label={option.label} key={option.id}>
            {createContextMenuItems((option as GroupedMenuOption).children)}
          </ContextSubMenuItem>
        );
      case MenuOptionType.GROUP_MENU:
        return (
          <Fragment key={option.id}>
            {option.label && <h1 className="pf-c-dropdown__group-title">{option.label}</h1>}
            {createContextMenuItems((option as GroupedMenuOption).children)}
          </Fragment>
        );
      default:
        return (
          <ActionMenuItem key={option.id} action={option as Action} component={ContextMenuItem} />
        );
    }
  });
};

export const graphActionContext = (graph: Graph, connectorSource?: Node) => ({
  'topology-context-actions': { element: graph, connectorSource },
});

export const groupActionContext = (element: Node, connectorSource?: Node) => ({
  'topology-context-actions': { element, connectorSource },
});

export const contextMenuActions = (element: Node) => {
  const resource = getResource(element);
  const { csvName } = element.getData()?.data ?? {};
  return {
    'topology-actions': element,
    ...(resource ? { [getReferenceForResource(resource)]: resource } : {}),
    ...(csvName ? { 'csv-actions': { csvName, resource } } : {}),
  };
};
