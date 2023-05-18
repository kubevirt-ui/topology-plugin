import React from 'react';

import { useBoundingClientRect } from '@patternfly/quickstarts/dist/ConsoleShared';
import { Modal, ModalVariant } from '@patternfly/react-core';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { DetailsRendererFunction, QuickSearchData } from '@topology-utils/types/quick-search-types';

import QuickSearchModalBody from './components/QuickSearchModalBody';

interface QuickSearchModalProps {
  isOpen: boolean;
  namespace: string;
  closeModal: () => void;
  allCatalogItemsLoaded: boolean;
  searchCatalog: (searchTerm: string) => QuickSearchData;
  searchPlaceholder: string;
  viewContainer?: HTMLElement;
  limitItemCount?: number;
  icon?: React.ReactNode;
  detailsRenderer?: DetailsRendererFunction;
}

const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  namespace,
  closeModal,
  searchCatalog,
  searchPlaceholder,
  allCatalogItemsLoaded,
  viewContainer,
  icon,
  limitItemCount,
  detailsRenderer,
}) => {
  const { t } = useTopologyTranslation();
  const clientRect = useBoundingClientRect(viewContainer);
  const maxHeight = clientRect?.height;
  const maxWidth = clientRect?.width;

  return viewContainer ? (
    <Modal
      className="ocs-quick-search-modal"
      variant={ModalVariant.medium}
      aria-label={t('console-shared~Quick search')}
      isOpen={isOpen}
      showClose={false}
      position="top"
      positionOffset="15%"
      hasNoBodyWrapper
      appendTo={viewContainer}
    >
      <QuickSearchModalBody
        allCatalogItemsLoaded={allCatalogItemsLoaded}
        searchCatalog={searchCatalog}
        searchPlaceholder={searchPlaceholder}
        namespace={namespace}
        closeModal={closeModal}
        limitItemCount={limitItemCount}
        icon={icon}
        detailsRenderer={detailsRenderer}
        maxDimension={{ maxHeight, maxWidth }}
        viewContainer={viewContainer}
      />
    </Modal>
  ) : null;
};

export default QuickSearchModal;
