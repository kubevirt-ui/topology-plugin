import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { CatalogItem } from '@openshift-console/dynamic-plugin-sdk';
import { Button, ButtonVariant, TextContent, Title } from '@patternfly/react-core';
import useTelemetry from '@topology-utils/hooks/useTelemetry/useTelemetry';
import { handleCta } from '@topology-utils/quick-search-utils';

import CatalogBadges from './CatalogBadges';

export type QuickSearchDetailsRendererProps = {
  selectedItem: CatalogItem;
  closeModal: () => void;
};
export type DetailsRendererFunction = (props: QuickSearchDetailsRendererProps) => ReactNode;
export interface QuickSearchDetailsProps extends QuickSearchDetailsRendererProps {
  detailsRenderer: DetailsRendererFunction;
}

const QuickSearchDetails: FC<QuickSearchDetailsProps> = ({
  selectedItem,
  closeModal,
  detailsRenderer,
}) => {
  const { t } = useTranslation();
  const fireTelemetryEvent = useTelemetry();

  const defaultContentRenderer: DetailsRendererFunction = (
    props: QuickSearchDetailsProps,
  ): ReactNode => {
    return (
      <>
        <Title headingLevel="h4">{props.selectedItem.name}</Title>
        {props.selectedItem.provider && (
          <span className="ocs-quick-search-details__provider">
            {t('console-shared~Provided by {{provider}}', {
              provider: props.selectedItem.provider,
            })}
          </span>
        )}
        {selectedItem.badges?.length > 0 ? (
          <CatalogBadges badges={selectedItem.badges} />
        ) : undefined}
        <Button
          variant={ButtonVariant.primary}
          className="ocs-quick-search-details__form-button"
          data-test="create-quick-search"
          onClick={(e) => {
            handleCta(e, props.selectedItem, props.closeModal, fireTelemetryEvent);
          }}
        >
          {props.selectedItem.cta.label}
        </Button>
        <TextContent className="ocs-quick-search-details__description">
          {props.selectedItem.description}
        </TextContent>
      </>
    );
  };
  const detailsContentRenderer: DetailsRendererFunction = detailsRenderer ?? defaultContentRenderer;

  return (
    <div className="ocs-quick-search-details">
      {detailsContentRenderer({ selectedItem, closeModal })}
    </div>
  );
};

export default QuickSearchDetails;
