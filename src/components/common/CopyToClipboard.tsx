import React, { FC, memo, ReactNode, useState } from 'react';
import { CopyToClipboard as CTC } from 'react-copy-to-clipboard';

import { Button, CodeBlock, CodeBlockAction, CodeBlockCode, Tooltip } from '@patternfly/react-core';
import { CopyIcon } from '@patternfly/react-icons';
import { isNil } from '@topology-utils/common-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

export type CopyToClipboardProps = {
  value: string;
  visibleValue?: ReactNode;
};

const CopyToClipboard: FC<CopyToClipboardProps> = memo((props) => {
  const [copied, setCopied] = useState(false);

  const { t } = useTopologyTranslation();
  const tooltipText = copied ? t('Copied') : t('Copy to clipboard');
  const tooltipContent = [
    <span className="co-nowrap" key="nowrap">
      {tooltipText}
    </span>,
  ];

  // Default to value if no visible value was specified.
  const visibleValue = isNil(props.visibleValue) ? props.value : props.visibleValue;

  const actions = (
    <CodeBlockAction>
      <Tooltip content={tooltipContent} trigger="click mouseenter focus" exitDelay={1250}>
        <CTC text={props.value} onCopy={() => setCopied(true)}>
          <Button
            variant="plain"
            onMouseEnter={() => setCopied(false)}
            className="co-copy-to-clipboard__btn"
            type="button"
          >
            <CopyIcon />
            <span className="sr-only">{t('Copy to clipboard')}</span>
          </Button>
        </CTC>
      </Tooltip>
    </CodeBlockAction>
  );

  return (
    <CodeBlock actions={actions} className="co-copy-to-clipboard">
      <CodeBlockCode className="co-copy-to-clipboard__text" data-test="copy-to-clipboard">
        {visibleValue}
      </CodeBlockCode>
    </CodeBlock>
  );
});

export default CopyToClipboard;
