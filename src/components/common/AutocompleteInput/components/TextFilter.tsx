import React from 'react';
import classNames from 'classnames';
import { KEYBOARD_SHORTCUTS } from 'src/const';

import { TextInput, TextInputProps } from '@patternfly/react-core';
import useDocumentListener from '@topology-utils/hooks/useDocumentListener/useDocumentListener';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

type TextFilterProps = Omit<TextInputProps, 'type' | 'tabIndex'> & {
  label?: string;
  parentClassName?: string;
};

export const TextFilter: React.FC<TextFilterProps> = (props) => {
  const {
    label,
    className,
    placeholder,
    autoFocus = false,
    parentClassName,
    ...otherInputProps
  } = props;
  const { ref } = useDocumentListener<HTMLInputElement>();
  const { t } = useTopologyTranslation();
  const placeholderText = placeholder ?? t('public~Filter {{label}}...', { label });

  return (
    <div className={classNames('has-feedback', parentClassName)}>
      <TextInput
        {...otherInputProps}
        className={classNames('co-text-filter', className)}
        data-test-id="item-filter"
        aria-label={placeholderText}
        placeholder={placeholderText}
        ref={ref}
        autoFocus={autoFocus}
        tabIndex={0}
        type="text"
      />
      <span className="co-text-filter-feedback">
        <kbd className="co-kbd co-kbd__filter-input">{KEYBOARD_SHORTCUTS.focusFilterInput}</kbd>
      </span>
    </div>
  );
};
