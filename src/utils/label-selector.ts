/* eslint-disable guard-for-in, default-case, no-case-declarations */

import intersection from 'lodash.intersection';
import { matches } from 'lodash.matches';
import pickBy from 'lodash.pickby';

import { bind, isEmpty } from './common-utils';
/**
 * Converted from Angular based  "kubernetes-label-selector"
 *    git://github.com/kubernetes-ui/label-selector.git
 *    author: Jessica Forrester <jforrest@redhat.com>
 **/
// selector (optional) - the JSON format as returned by k8s API, will also
//      handle {key: null} as the key exists operator (not currently returned
//      by API)
// emptySelectsAll (optional) - whether a label selector with no conjuncts
//      selects objects.  Typical behavior is false.  Example of an
//      exceptional case is when filtering by labels, no label selectors
//      means no filters.
class LabelSelector {
  private _conjuncts: Record<string, any>;
  private _emptySelectsAll: boolean;
  private _OPERATOR_MAP: { In: string; Exists: string; NotIn: string; DoesNotExist: string };
  private _REVERSE_OPERATOR_MAP: {
    'does not exist': string;
    'not in': string;
    in: string;
    exists: string;
  };
  constructor(selector?: any, emptySelectsAll?: any) {
    this._conjuncts = {};
    this._emptySelectsAll = !!emptySelectsAll;
    // expects the JSON format as returned by k8s API
    // Supports both the old selector syntax of just key: value pairs like on RCs
    // as well as the new matchLabel and matchExpression syntax on newer controllers like ReplicaSets
    // For now it will also handle key: null as key exists for backwards compatibility from before
    // the matchExpression support was added.
    this._OPERATOR_MAP = {
      In: 'in',
      NotIn: 'not in',
      Exists: 'exists',
      DoesNotExist: 'does not exist',
    };
    this._REVERSE_OPERATOR_MAP = {
      in: 'In',
      'not in': 'NotIn',
      exists: 'Exists',
      'does not exist': 'DoesNotExist',
    };
    if (selector) {
      if (selector.matchLabels || selector.matchExpressions) {
        selector.matchLabels?.forEach((details, key) => {
          this.addConjunct(key, 'in', [details]);
        }, this);
        selector.matchExpressions?.forEach((expression) => {
          this.addConjunct(
            expression.key,
            this._OPERATOR_MAP[expression.operator],
            expression.values,
          );
        }, this);
      } else {
        selector?.forEach((details, key) => {
          if (details || details === '') {
            this.addConjunct(key, 'in', [details]);
          } else {
            this.addConjunct(key, 'exists', []);
          }
        }, this);
      }
    }
  }

  addConjunct(key, operator, values) {
    const conjunct = {
      key,
      operator,
      values,
    };
    const id = this._getIdForConjunct(conjunct);
    this._conjuncts[id] = conjunct;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    conjunct.id = id;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    conjunct.string = this._getStringForConjunct(conjunct);
    return conjunct;
  }

  // Can accept either the id of the conjunct to remove, or the conjunct
  // object that was returned from a call to addConjunct
  removeConjunct(conjunct) {
    if (conjunct.id) {
      delete this._conjuncts[conjunct.id];
    } else {
      delete this._conjuncts[conjunct];
    }
  }
  clearConjuncts() {
    this._conjuncts = {};
  }
  isEmpty() {
    return isEmpty(this._conjuncts);
  }
  each(fn) {
    this._conjuncts?.forEach(fn);
  }
  select(resources) {
    // If passed an array, return an array.
    if (Array.isArray(resources)) {
      return resources?.filter(bind(this.matches, this));
    }
    // Otherwise handle it as a map.
    return pickBy(resources, bind(this.matches, this));
  }
  matchesLabels(labels) {
    if (this.isEmpty()) {
      return this._emptySelectsAll;
    }
    for (const id in this._conjuncts) {
      const conjunct = this._conjuncts[id];
      switch (conjunct.operator) {
        case 'exists':
          if (!labels[conjunct.key] && labels[conjunct.key] !== '') {
            return false;
          }
          break;
        case 'does not exist':
          if (labels[conjunct.key] || labels[conjunct.key] === '') {
            return false;
          }
          break;
        case 'in':
          let found = false;
          if (labels[conjunct.key] || labels[conjunct.key] === '') {
            for (let i = 0; !found && i < conjunct.values.length; i++) {
              if (labels[conjunct.key] === conjunct.values[i]) {
                found = true;
              }
            }
          }
          if (!found) {
            return false;
          }
          break;
        case 'not in':
          let keep = true;
          if (labels[conjunct.key]) {
            for (let i = 0; keep && i < conjunct.values.length; i++) {
              keep = labels[conjunct.key] !== conjunct.values[i];
            }
          }
          if (!keep) {
            return false;
          }
      }
    }
    return true;
  }
  matches(resource) {
    if (!resource) {
      return false;
    }
    const labels = resource.metadata?.labels || {};
    return this.matchesLabels(labels);
  }
  hasConjunct(conjunct) {
    return !!this._conjuncts[this._getIdForConjunct(conjunct)];
  }
  findConjunctsMatching(operator, key) {
    return pickBy(
      this._conjuncts,
      matches({
        operator,
        key,
      }),
    );
  }
  // Test whether this label selector covers the given selector
  covers(selector) {
    if (this.isEmpty()) {
      // TODO don't think we ever want to consider an empty
      // label selector as covering any other label selector
      return false;
    }
    return this._conjuncts?.every(function (conjunct) {
      // Return true immediately if we find an exact match for operator/key/values
      if (selector.hasConjunct(conjunct)) {
        return true;
      }
      // If we can't find a conjunct that matches exactly, do a more detailed check
      switch (conjunct.operator) {
        case 'exists':
          // If an Exists conjunct existed for the same key in selector it
          // would have passed the exact match, just need to check if an In
          // conjunct exists for the same key
          return !isEmpty(selector.findConjunctsMatching('in', conjunct.key));
        case 'does not exist':
          // A DoesNotExist can only cover a DoesNotExist operator, if we got here
          // then we didn't have a DNE with the same key so we know we can't cover
          return false;
        case 'in':
          // In (A,B,C) covers In (A,B) AND In (B,C)
          const inConjuncts = selector.findConjunctsMatching('in', conjunct.key);
          if (isEmpty(inConjuncts)) {
            return false;
          }
          return inConjuncts?.every(function (inConjunct) {
            return (
              inConjunct.values.length === intersection(inConjunct.values, conjunct.values).length
            );
          });
        case 'not in':
          // NotIn (A,B) covers NotIn (A,B,C) AND NotIn (A,B,D)
          const notInConjuncts = selector.findConjunctsMatching('not in', conjunct.key);
          if (isEmpty(notInConjuncts)) {
            return false;
          }
          return notInConjuncts?.every(function (notInConjunct) {
            return (
              conjunct.values.length === intersection(notInConjunct.values, conjunct.values).length
            );
          });
      }
      return true;
    });
  }

  // Exports the labelSelector as a string in the API format, exports as matchExpressions
  exportJSON() {
    const result = {
      matchExpressions: [],
    };
    for (const id in this._conjuncts) {
      const conjunct = this._conjuncts[id];
      const expression = {
        key: conjunct.key,
        operator: this._REVERSE_OPERATOR_MAP[conjunct.operator],
        values: conjunct.values,
      };
      result.matchExpressions.push(expression);
    }
    return JSON.stringify(result);
  }

  // We assume label values have no whitespace, commas, parens, etc. based
  // on k8s def for label values
  _getStringForConjunct(conjunct) {
    let conjunctString = conjunct.key;
    if (conjunct.operator === 'exists') {
      return `${conjunctString} exists`;
    } else if (conjunct.operator === 'does not exist') {
      return `${conjunctString} does not exist`;
    }
    if (conjunct.operator === 'not in') {
      conjunctString += ' not';
    }
    conjunctString += ' in (';
    for (let i = 0; i < conjunct.values.length; i++) {
      if (conjunct.values[i] === '') {
        conjunctString += '""';
      } else {
        conjunctString += conjunct.values[i];
      }
      if (i !== conjunct.values.length - 1) {
        conjunctString += ', ';
      }
    }
    conjunctString += ')';

    return conjunctString;
  }

  _getIdForConjunct(conjunct) {
    let id = `${conjunct.key}-${conjunct.operator}`;
    if (conjunct.values) {
      id += `-${conjunct.values.join(',')}`;
    }
    return id;
  }
}

export default LabelSelector;
