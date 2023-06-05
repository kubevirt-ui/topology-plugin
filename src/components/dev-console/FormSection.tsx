import React, { CSSProperties, FC, ReactNode } from 'react';
import cx from 'classnames';

import { FormHelperText } from '@patternfly/react-core';

export interface FormSectionProps {
  title?: ReactNode;
  subTitle?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
  flexLayout?: boolean;
  extraMargin?: boolean;
  dataTest?: string;
  style?: CSSProperties;
}

const flexStyle: CSSProperties = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  margin: 'var(--pf-global--spacer--md) 0',
};

const FormSection: FC<FormSectionProps> = ({
  title,
  subTitle,
  fullWidth,
  children,
  flexLayout,
  extraMargin,
  dataTest,
  style,
}) => (
  <div
    className={cx('pf-c-form', {
      'co-m-pane__form': !fullWidth,
      'odc-form-section--extra-margin': extraMargin,
    })}
    style={{ ...(flexLayout ? flexStyle : {}), ...(style || {}) }}
    data-test={dataTest}
  >
    {title && <h2 className="odc-form-section__heading">{title}</h2>}
    {subTitle && <FormHelperText isHidden={false}>{subTitle}</FormHelperText>}
    {children}
  </div>
);

export default FormSection;
