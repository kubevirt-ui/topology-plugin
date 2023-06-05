import React from 'react';

import BaseLabelsModal from '../BaseLabelsModal';
import { LABELS_PATH } from '../utils/const';

const LabelsModal = createModalLauncher((props) => (
  <BaseLabelsModal path={LABELS_PATH} {...props} />
));

export default LabelsModal;
