import { Children, cloneElement } from 'react';
import isObject from 'lodash.isobject';

export const injectDisabled = (children, disabled) => {
  return Children.map(children, (c) => {
    if (!isObject(c) || c.type !== 'button') {
      return c;
    }

    return cloneElement(c, { disabled: c.props.disabled || disabled });
  });
};
