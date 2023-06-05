import React, { FunctionComponent, MouseEvent, Ref } from 'react';
import { Link } from 'react-router-dom';

import { Decorator as PfDecorator } from '@patternfly/react-topology';

import './Decorator.scss';

type DecoratorTypes = {
  x: number;
  y: number;
  radius: number;
  onClick?(event: MouseEvent<SVGGElement, MouseEvent>): void;
  href?: string;
  ariaLabel?: string;
  external?: boolean;
  circleRef?: Ref<SVGCircleElement>;
};

const Decorator: FunctionComponent<DecoratorTypes> = ({
  x,
  y,
  radius,
  href,
  ariaLabel,
  external,
  ...rest
}) => {
  const decorator = (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <PfDecorator x={x} y={y} radius={radius} className="odc-decorator" showBackground {...rest} />
  );

  if (href) {
    return external ? (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line
      <a
        className="odc-decorator__link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.stopPropagation();
        }}
        role="button"
        aria-label={ariaLabel}
      >
        {decorator}
      </a>
    ) : (
      <Link className="odc-decorator__link" to={href} role="button" aria-label={ariaLabel}>
        {decorator}
      </Link>
    );
  }
  return decorator;
};

export default Decorator;
