import React, { FC } from 'react';

import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import Box from './Box';

type EmptyBoxProps = {
  label?: string;
};

const EmptyBox: FC<EmptyBoxProps> = ({ label }) => {
  const { t } = useTopologyTranslation();
  return (
    <Box>
      <div data-test="empty-message" className="pf-u-text-align-center">
        {label ? t('No {{label}} found', { label }) : t('Not found')}
      </div>
    </Box>
  );
};

export default EmptyBox;
