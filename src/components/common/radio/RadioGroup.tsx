import React, { InputHTMLAttributes, SFC } from 'react';
import classNames from 'classnames';

import RadioInput from './RadioInput';

export type RadioGroupProps = {
  currentValue: any;
  id?: string;
  inline?: boolean;
  items: ({
    desc?: string | JSX.Element;
    title: string | JSX.Element;
    subTitle?: string | JSX.Element;
    value: any;
    disabled?: boolean;
  } & InputHTMLAttributes<any>)[];
  label?: string;
  onChange: InputHTMLAttributes<any>['onChange'];
};

const RadioGroup: SFC<RadioGroupProps> = ({
  currentValue,
  inline = false,
  items,
  label,
  onChange,
  id = JSON.stringify(items),
}) => {
  const radios = items.map(({ desc, title, subTitle, value, disabled }) => (
    <RadioInput
      key={value}
      checked={value === currentValue}
      desc={desc}
      onChange={onChange}
      title={title}
      subTitle={subTitle}
      value={value}
      disabled={disabled}
      inline={inline}
    />
  ));
  return (
    <div className={classNames('co-radio-group', { 'co-radio-group--inline': inline })}>
      {label ? (
        <>
          <label className="form-label co-radio-group__label" htmlFor={id}>
            {label}
          </label>
          <div className="co-radio-group__controls" id={id}>
            {radios}
          </div>
        </>
      ) : (
        radios
      )}
    </div>
  );
};

export default RadioGroup;
