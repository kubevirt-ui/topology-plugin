import { MatchExpression } from '@openshift-console/dynamic-plugin-sdk';
import { requirementFromString } from '@topology-utils/selector-requirement';

type Options = { undefinedWhenEmpty?: boolean; basic?: boolean };

export const fromRequirements = (requirements: MatchExpression[], options = {} as Options) => {
  options = options || {};
  const selector = {
    matchLabels: {},
    matchExpressions: [],
  };

  if (options.undefinedWhenEmpty && requirements.length === 0) {
    return;
  }

  requirements.forEach((r) => {
    if (r.operator === 'Equals') {
      selector.matchLabels[r.key] = r.values[0];
    } else {
      selector.matchExpressions.push(r);
    }
  });

  // old selector format?
  if (options.basic) {
    return selector.matchLabels;
  }

  return selector;
};

export const split = (str: string) => (str.trim() ? str.split(/,(?![^(]*\))/) : []); // [''] -> []

export const selectorFromString = (str: string) => {
  const requirements = split(str || '').map(requirementFromString) as MatchExpression[];
  return fromRequirements(requirements);
};
