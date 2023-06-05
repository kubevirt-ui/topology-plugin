import React, { Component } from 'react';
import TagsInput from 'react-tagsinput';
import classNames from 'classnames';
import capitalize from 'lodash.capitalize';
import get from 'lodash.get';
import isEqual from 'lodash.isequal';

import { selectorToString } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s';
import { Label as PfLabel } from '@patternfly/react-core';
import { isEmpty } from '@topology-utils/common-utils';
import { requirementFromString } from '@topology-utils/selector-requirement';
import { selectorFromString } from '@topology-utils/selector-utils';

// Helpers for cleaning up tags by running them through the selector parser
const cleanSelectorStr = (tag) => selectorToString(selectorFromString(tag));
const cleanTags = (tags) => split(cleanSelectorStr(tags.join(',')));

export const split = (str: string) => (str.trim() ? str.split(/,(?![^(]*\))/) : []);

type SelectorInputProps = {
  options?: any;
  tags: any;
  autoFocus: any;
  inputProps?: any;
  placeholder?: any;
  onChange: any;
  labelClassName: any;
};

type SelectorInputState = {
  inputValue: string;
  isInputValid: boolean;
  tags: any;
};

export class SelectorInput extends Component<SelectorInputProps, SelectorInputState> {
  private isBasic: boolean;
  private setRef: (ref) => any;
  private ref_: any;
  constructor(props) {
    super(props);
    this.isBasic = !!get(this.props.options, 'basic');
    this.setRef = (ref) => (this.ref_ = ref);
    this.state = {
      inputValue: '',
      isInputValid: true,
      tags: this.props.tags,
    };
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.tags, this.props.tags)) {
      this.setState({ tags: this.props.tags });
    }
  }
  static arrayify(obj) {
    return obj?.map((v, k) => (v ? `${k}=${v}` : k));
  }

  static objectify(arr) {
    const result = {};
    arr?.forEach((item) => {
      const [key, value = null] = item.split('=');
      result[key] = value;
    });
    return result;
  }

  static arrayObjectsToArrayStrings(obj) {
    return obj?.map((v) => `${v.key} ${v.operator.toLowerCase()} (${v.values.join(',')})`);
  }

  static arrayToArrayOfObjects(arr) {
    const result = [];
    for (const item of arr) {
      if (item.includes('(')) {
        const [key, operator, values] = item.split(' ');
        result.push({
          key,
          operator: capitalize(operator),
          // eslint-disable-next-line no-useless-escape
          values: values.replace(/[\(\)]/g, '').split(','),
        });
      }
    }
    return result;
  }
  focus() {
    this.ref_ && this.ref_.focus();
  }

  isTagValid(tag) {
    const requirement = requirementFromString(tag);
    return !!(requirement && (!this.isBasic || requirement.operator === 'Equals'));
  }

  handleInputChange(e) {
    // We track the input field value in state so we can retain the input value when an invalid tag is entered.
    // Otherwise, the default behaviour of TagsInput is to clear the input field.
    const inputValue = e.target.value;

    // If the user deletes an existing inputValue, set isInputValid back to true
    if (inputValue === '') {
      this.setState({ inputValue, isInputValid: true });
      return;
    }

    this.setState({ inputValue, isInputValid: this.isTagValid(inputValue) });
  }

  handleChange(tags, changed) {
    // The way we use TagsInput, there should only ever be one new tag in changed
    const newTag = changed[0];

    if (!this.isTagValid(newTag)) {
      this.setState({ isInputValid: false });
      return;
    }

    // Clean up the new tag by running it through the selector parser
    const cleanNewTag = cleanSelectorStr(newTag);

    // Is the new tag a duplicate of an already existing tag?
    // Note that TagsInput accepts an onlyUnique property, but we handle this logic ourselves so that we can set a
    // custom error class
    if (tags?.filter((tag) => tag === cleanNewTag).length > 1) {
      this.setState({ isInputValid: false });
      return;
    }

    const newTags = cleanTags(tags);
    this.setState({ inputValue: '', isInputValid: true, tags: newTags });
    this.props.onChange(newTags);
  }

  render() {
    const { inputValue, isInputValid, tags } = this.state;

    // Keys that add tags: Enter
    const addKeys = [13];

    // Backspace deletes tags, but not if there is text being edited in the input field
    const removeKeys = inputValue.length ? [] : [8];

    const inputProps = {
      autoFocus: this.props.autoFocus,
      className: classNames('input', { 'invalid-tag': !isInputValid }),
      onChange: this.handleInputChange.bind(this),
      placeholder: isEmpty(tags) ? this.props.placeholder || 'app=frontend' : '',
      spellCheck: 'false',
      value: inputValue,
      id: 'tags-input',
      ['data-test']: 'tags-input',
      ...(this.props.inputProps || {}),
    };

    const renderTag = ({ tag, key, onRemove, getTagDisplayValue }) => {
      return (
        <PfLabel
          className={classNames('co-label tag-item-content', this.props.labelClassName)}
          key={key}
          onClose={() => onRemove(key)}
          isTruncated
        >
          {getTagDisplayValue(tag)}
        </PfLabel>
      );
    };

    return (
      <div className="pf-c-form-control">
        <tags-input>
          <TagsInput
            ref={this.setRef}
            className="tags"
            value={tags}
            addKeys={addKeys}
            removeKeys={removeKeys}
            inputProps={inputProps}
            renderTag={renderTag}
            onChange={this.handleChange.bind(this)}
            addOnBlur
          />
        </tags-input>
      </div>
    );
  }
}

export default SelectorInput;
