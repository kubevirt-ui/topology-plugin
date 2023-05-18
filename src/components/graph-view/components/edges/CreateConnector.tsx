import React, { FC } from 'react';

import { DefaultCreateConnector, Point } from '@patternfly/react-topology';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

type CreateConnectorProps = {
  startPoint: Point;
  endPoint: Point;
  hints: string[];
  dragging?: boolean;
  hover?: boolean;
};

const CreateConnector: FC<CreateConnectorProps> = ({
  startPoint,
  endPoint,
  dragging,
  hover,
  hints,
}) => {
  const { t } = useTopologyTranslation();
  return (
    <DefaultCreateConnector
      startPoint={startPoint}
      endPoint={endPoint}
      dragging={dragging}
      hints={hints}
      hover={hover}
      tipContents={hover && dragging ? t('Add resources') : null}
    />
  );
};

export default CreateConnector;
