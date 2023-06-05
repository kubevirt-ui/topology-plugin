import React, { MouseEvent, SFC } from 'react';

import { Button } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';

type EditButtonProps = {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  testId?: string;
};

const EditButton: SFC<EditButtonProps> = (props) => {
  return (
    <Button
      type="button"
      variant="link"
      isInline
      onClick={props.onClick}
      data-test={
        props.testId ? `${props.testId}-details-item__edit-button` : 'details-item__edit-button'
      }
    >
      {props.children}
      <PencilAltIcon className="co-icon-space-l pf-c-button-icon--plain" />
    </Button>
  );
};

export default EditButton;
