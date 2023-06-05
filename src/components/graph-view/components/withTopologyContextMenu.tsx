import React, { ComponentProps, ComponentType, FC, useCallback, useContext, useState } from 'react';
import { observer } from 'mobx-react';

import { ActionServiceProvider } from '@openshift-console/dynamic-plugin-sdk';
import { ActionContext } from '@openshift-console/dynamic-plugin-sdk/lib/api/internal-types';
import { ContextMenu, ElementContext, GraphElement } from '@patternfly/react-topology';

import { createContextMenuItems } from '../../../actions';

type Reference = ComponentProps<typeof ContextMenu>['reference'];

export interface WithContextMenuProps {
  onContextMenu: (e: MouseEvent) => void;
  contextMenuOpen: boolean;
}

const withContextMenu =
  <E extends GraphElement>(
    actionContext: (element: E) => ActionContext,
    container?: Element | null | undefined | (() => Element),
    className?: string,
    atPoint = true,
  ) =>
  <P extends WithContextMenuProps>(WrappedComponent: ComponentType<P>) => {
    const Component: FC<Omit<P, keyof WithContextMenuProps>> = (props) => {
      const element = useContext(ElementContext);
      const [reference, setReference] = useState<Reference | null>(null);
      const onContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setReference(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          atPoint
            ? {
                x: e.pageX,
                y: e.pageY,
              }
            : e.currentTarget,
        );
      }, []);

      return (
        <>
          <WrappedComponent
            {...(props as any)}
            onContextMenu={onContextMenu}
            contextMenuOpen={!!reference}
          />
          {reference ? (
            <ActionServiceProvider context={actionContext(element as E)}>
              {({ options, loaded }) =>
                loaded ? (
                  <ContextMenu
                    reference={reference}
                    container={container}
                    className={className}
                    open
                    onRequestClose={() => setReference(null)}
                  >
                    {createContextMenuItems(options)}
                  </ContextMenu>
                ) : null
              }
            </ActionServiceProvider>
          ) : null}
        </>
      );
    };
    Component.displayName = `withContextMenu(${
      WrappedComponent.displayName || WrappedComponent.name
    })`;
    return observer(Component);
  };

export default withContextMenu;
