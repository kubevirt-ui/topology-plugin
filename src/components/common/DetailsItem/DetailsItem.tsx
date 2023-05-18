import React, { FC, MouseEvent, ReactNode } from 'react';
import classNames from 'classnames';
import get from 'lodash.get';

import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { Button, Popover, Split, SplitItem } from '@patternfly/react-core';
import { isEmpty } from '@topology-utils/common-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { getPropertyDescription } from '@topology-utils/swagger-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import EditButton from './components/EditButton';
import LinkifyExternal from './components/LinkifyExternal';
import PropertyPath from './components/PropertyPath';

export type DetailsItemProps = {
  canEdit?: boolean;
  defaultValue?: ReactNode;
  description?: string;
  editAsGroup?: boolean;
  hideEmpty?: boolean;
  label: string;
  labelClassName?: string;
  obj?: K8sResourceKind;
  onEdit?: (e: MouseEvent<HTMLButtonElement>) => void;
  path?: string | string[];
  valueClassName?: string;
};

const DetailsItem: FC<DetailsItemProps> = ({
  children,
  defaultValue = '-',
  description,
  editAsGroup,
  hideEmpty,
  label,
  labelClassName,
  obj,
  onEdit,
  canEdit = true,
  path,
  valueClassName,
}) => {
  const { t } = useTopologyTranslation();
  const model = getK8sModel(obj);
  const hide = hideEmpty && isEmpty(get(obj, path));
  const popoverContent: string = description ?? getPropertyDescription(model, path);
  const value: ReactNode = children || get(obj, path, defaultValue);
  const editable = onEdit && canEdit;
  return hide ? null : (
    <>
      <dt
        className={classNames('details-item__label', labelClassName)}
        data-test-selector={`details-item-label__${label}`}
      >
        <Split>
          <SplitItem className="details-item__label">
            {popoverContent || path ? (
              <Popover
                headerContent={<div>{label}</div>}
                {...(popoverContent && {
                  bodyContent: (
                    <LinkifyExternal>
                      <div className="co-pre-line">{popoverContent}</div>
                    </LinkifyExternal>
                  ),
                })}
                {...(path && { footerContent: <PropertyPath kind={model?.kind} path={path} /> })}
                maxWidth="30rem"
              >
                <Button data-test={label} variant="plain" className="details-item__popover-button">
                  {label}
                </Button>
              </Popover>
            ) : (
              label
            )}
          </SplitItem>
          {editable && editAsGroup && (
            <>
              <SplitItem isFilled />
              <SplitItem>
                <EditButton testId={label} onClick={onEdit}>
                  {t('Edit')}
                </EditButton>
              </SplitItem>
            </>
          )}
        </Split>
      </dt>
      <dd
        className={classNames('details-item__value', valueClassName, {
          'details-item__value--group': editable && editAsGroup,
        })}
        data-test-selector={`details-item-value__${label}`}
      >
        {editable && !editAsGroup ? (
          <EditButton testId={label} onClick={onEdit}>
            {value}
          </EditButton>
        ) : (
          value
        )}
      </dd>
    </>
  );
};

export default DetailsItem;
