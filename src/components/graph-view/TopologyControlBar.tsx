import React, { FC } from 'react';

import {
  action,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  observer,
  TopologyControlBar as PfTopologyControlBar,
  Visualization,
} from '@patternfly/react-topology';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import './TopologyControlBar.scss';

interface ControlBarProps {
  visualization: Visualization;
  isDisabled: boolean;
}

const TopologyControlBar: FC<ControlBarProps> = observer(({ visualization, isDisabled }) => {
  const { t } = useTopologyTranslation();
  return (
    <span className="pf-topology-control-bar odc-topology-control-bar">
      <PfTopologyControlBar
        controlButtons={[
          ...createTopologyControlButtons({
            ...defaultControlButtonsOptions,
            zoomInCallback: action(() => {
              visualization.getGraph().scaleBy(4 / 3);
            }),
            zoomInTip: t('Zoom in'),
            zoomInAriaLabel: t('Zoom in'),
            zoomInDisabled: isDisabled,
            zoomOutCallback: action(() => {
              visualization.getGraph().scaleBy(0.75);
            }),
            zoomOutTip: t('Zoom out'),
            zoomOutAriaLabel: t('Zoom out'),
            zoomOutDisabled: isDisabled,
            fitToScreenCallback: action(() => {
              visualization.getGraph().fit(80);
            }),
            fitToScreenTip: t('Fit to screen'),
            fitToScreenAriaLabel: t('Fit to screen'),
            fitToScreenDisabled: isDisabled,
            resetViewCallback: action(() => {
              visualization.getGraph().reset();
              visualization.getGraph().layout();
            }),
            resetViewTip: t('Reset view'),
            resetViewAriaLabel: t('Reset view'),
            resetViewDisabled: isDisabled,
            legend: false,
          }),
        ]}
      />
    </span>
  );
});

export default TopologyControlBar;
