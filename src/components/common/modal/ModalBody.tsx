import React, { SFC } from 'react';
import classNames from 'classnames';

export type ModalBodyProps = {
  className?: string;
};

const ModalBody: SFC<ModalBodyProps> = ({ children, className }) => (
  <div className="modal-body">
    <div className={classNames('modal-body-content', className)}>{children}</div>
  </div>
);

export default ModalBody;
