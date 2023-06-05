import React, { FC, useState } from 'react';
import { CopyToClipboard as CTC } from 'react-copy-to-clipboard';
import classNames from 'classnames';

import { Tooltip } from '@patternfly/react-core';
import { CopyIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

type ExternalLinkWithCopyProps = {
  link: string;
  text?: string;
  dataTestID?: string;
  additionalClassName?: string;
};

const ExternalLinkWithCopy: FC<ExternalLinkWithCopyProps> = ({
  link,
  text,
  additionalClassName,
  dataTestID,
}) => {
  const [copied, setCopied] = useState(false);

  const { t } = useTopologyTranslation();
  const tooltipText = copied ? t('Copied to clipboard') : t('Copy to clipboard');
  const tooltipContent = [
    <span className="co-nowrap" key="nowrap">
      {tooltipText}
    </span>,
  ];

  return (
    <div className={classNames(additionalClassName)}>
      <a href={link} target="_blank" rel="noopener noreferrer" data-test-id={dataTestID}>
        {text ?? link}
      </a>
      <span className="co-icon-nowrap">
        &nbsp;
        <span className="co-external-link-with-copy__icon co-external-link-with-copy__externallinkicon">
          <ExternalLinkAltIcon />
        </span>
        <Tooltip content={tooltipContent} trigger="click mouseenter focus" exitDelay={1250}>
          <CTC text={link} onCopy={() => setCopied(true)}>
            <span
              onMouseEnter={() => setCopied(false)}
              className="co-external-link-with-copy__icon co-external-link-with-copy__copyicon"
            >
              <CopyIcon />
              <span className="sr-only">{t('Copy to clipboard')}</span>
            </span>
          </CTC>
        </Tooltip>
      </span>
    </div>
  );
};

export default ExternalLinkWithCopy;
