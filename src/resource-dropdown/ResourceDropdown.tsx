import React, { Component, ReactElement, ReactNode } from 'react';
import { TFunction } from 'i18next';
import get from 'lodash.get';
import isEqual from 'lodash/isEqual';

import { FirehoseResult } from '@openshift-console/dynamic-plugin-sdk';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { getNamespace, isEmpty } from '@topology-utils/common-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import LoadingInline from '../components/common/LoadingInline/LoadingInline';

import DropdownItem from './components/DropdownItem';

interface State {
  resources: Record<string, unknown>;
  items: Record<string, unknown>;
  title: ReactNode;
}

export interface ResourceDropdownItems {
  [key: string]: string | ReactElement;
}

export interface ResourceDropdownProps {
  id?: string;
  ariaLabel?: string;
  className?: string;
  dropDownClassName?: string;
  menuClassName?: string;
  buttonClassName?: string;
  title?: ReactNode;
  titlePrefix?: string;
  allApplicationsKey?: string;
  userSettingsPrefix?: string;
  storageKey?: string;
  disabled?: boolean;
  allSelectorItem?: {
    allSelectorKey?: string;
    allSelectorTitle?: string;
  };
  noneSelectorItem?: {
    noneSelectorKey?: string;
    noneSelectorTitle?: string;
  };
  actionItems?: {
    actionTitle: string;
    actionKey: string;
  }[];
  dataSelector: string[] | number[] | symbol[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  transformLabel?: Function;
  loaded?: boolean;
  loadError?: string;
  placeholder?: string;
  resources?: FirehoseResult[];
  selectedKey: string;
  autoSelect?: boolean;
  resourceFilter?: (resource: K8sResourceKind) => boolean;
  onChange?: (key: string, name?: string | object, selectedResource?: K8sResourceKind) => void;
  onLoad?: (items: ResourceDropdownItems) => void;
  showBadge?: boolean;
  autocompleteFilter?: (strText: string, item: object) => boolean;
  customResourceKey?: (key: string, resource: K8sResourceKind) => string;
  appendItems?: ResourceDropdownItems;
  t: TFunction;
}

class ResourceDropdown extends Component<ResourceDropdownProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      resources: this.props.loaded ? this.getResourceList(props) : {},
      items: this.props.loaded ? this.getDropdownList(props, false) : {},
      title: this.props.loaded ? (
        <span className="btn-dropdown__item--placeholder">{this.props.placeholder}</span>
      ) : (
        <LoadingInline />
      ),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: ResourceDropdownProps) {
    const { loaded, loadError, autoSelect, selectedKey, placeholder, onLoad, title, actionItems } =
      nextProps;
    if (!loaded && !loadError) {
      this.setState({ title: <LoadingInline /> });
      return;
    }

    // If autoSelect is true only then have an item pre-selected based on selectedKey.
    if (!this.props.loadError && !autoSelect && (!this.props.loaded || !selectedKey)) {
      this.setState({
        title: <span className="btn-dropdown__item--placeholder">{placeholder}</span>,
      });
    }

    if (loadError) {
      this.setState({
        title: (
          <span className="cos-error-title">
            {this.props.t('plugin__topology-plugin~Error loading - {{placeholder}}', {
              placeholder,
            })}
          </span>
        ),
      });
      return;
    }

    const resourceList = this.getDropdownList({ ...this.props, ...nextProps }, true);
    // set placeholder as title if resourceList is empty no actionItems are there
    if (loaded && !loadError && isEmpty(resourceList) && !actionItems && placeholder && !title) {
      this.setState({
        title: <span className="btn-dropdown__item--placeholder">{placeholder}</span>,
      });
    }
    this.setState({ items: resourceList });
    if (nextProps.loaded && onLoad) {
      onLoad(resourceList);
    }
    this.setState({ resources: this.getResourceList(nextProps) });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (isEqual(this.state, nextState) && isEqual(this.props, nextProps)) {
      return false;
    }
    return true;
  }

  private craftResourceKey = (
    resource: K8sResourceKind,
    props: ResourceDropdownProps,
  ): { customKey: string; key: string } => {
    const { customResourceKey, resourceFilter, dataSelector } = props;
    let key;
    if (resourceFilter && resourceFilter(resource)) {
      key = get(resource, dataSelector);
    } else if (!resourceFilter) {
      key = get(resource, dataSelector);
    }
    return {
      customKey: customResourceKey ? customResourceKey(key, resource) : key,
      key,
    };
  };

  private getResourceList = (nextProps: ResourceDropdownProps) => {
    const { resources } = nextProps;
    const resourceList = {};
    resources?.forEach(({ data }) => {
      data?.forEach((resource) => {
        const { customKey, key } = this.craftResourceKey(resource, nextProps);
        const indexKey = customKey || key;
        if (indexKey) {
          resourceList[indexKey] = resource;
        }
      });
    });
    return resourceList;
  };

  private getDropdownList = (props: ResourceDropdownProps, updateSelection: boolean) => {
    const {
      loaded,
      actionItems,
      autoSelect,
      selectedKey,
      resources,
      transformLabel,
      allSelectorItem,
      noneSelectorItem,
      showBadge = false,
      appendItems,
    } = props;

    const unsortedList = { ...appendItems };
    const namespaces = new Set(resources?.map(({ data }) => data?.map(getNamespace)).flat());
    const containsMultipleNs = namespaces.size > 1;
    resources?.forEach(({ data, kind }) => {
      data?.reduce((acc, resource) => {
        const { customKey, key: name } = this.craftResourceKey(resource, props);
        const dataValue = customKey || name;
        if (dataValue) {
          if (showBadge) {
            const model = getK8sModel(resource) || (kind && getK8sModel(kind));
            const namespace = containsMultipleNs ? getNamespace(resource) : null;
            acc[dataValue] = model ? (
              <DropdownItem
                key={resource.metadata.uid}
                model={model}
                name={name}
                namespace={namespace}
              />
            ) : (
              name
            );
          } else {
            acc[dataValue] = transformLabel ? transformLabel(resource) : name;
          }
        }
        return acc;
      }, unsortedList);
    });
    const sortedList = {};

    if (allSelectorItem && !isEmpty(unsortedList)) {
      sortedList[allSelectorItem.allSelectorKey] = allSelectorItem.allSelectorTitle;
    }
    if (noneSelectorItem && !isEmpty(unsortedList)) {
      sortedList[noneSelectorItem.noneSelectorKey] = noneSelectorItem.noneSelectorTitle;
    }

    Object.keys(unsortedList)
      .sort()
      .forEach((key) => {
        sortedList[key] = unsortedList[key];
      });

    if (updateSelection) {
      let selectedItem = selectedKey;
      if (
        (isEmpty(sortedList) || !sortedList[selectedKey]) &&
        allSelectorItem &&
        allSelectorItem.allSelectorKey !== selectedKey
      ) {
        selectedItem = allSelectorItem.allSelectorKey;
      } else if (autoSelect && !selectedKey) {
        selectedItem =
          loaded && isEmpty(sortedList) && actionItems
            ? actionItems[0].actionKey
            : get(Object.keys(sortedList), 0);
      }
      selectedItem && this.handleChange(selectedItem, sortedList);
    }
    return sortedList;
  };

  private handleChange = (key, items) => {
    const name = items[key];
    const { actionItems, onChange, selectedKey } = this.props;
    const selectedActionItem = actionItems && actionItems.find((ai) => key === ai.actionKey);
    const title = selectedActionItem ? selectedActionItem.actionTitle : name;
    if (title !== this.state.title) {
      this.setState({ title });
    }
    if (key !== selectedKey) {
      onChange && onChange(key, name, this.state.resources[key]);
    }
  };

  private onChange = (key: string) => {
    this.handleChange(key, this.state.items);
  };

  render() {
    return (
      <Dropdown
        id={this.props.id}
        ariaLabel={this.props.ariaLabel}
        className={this.props.className}
        dropDownClassName={this.props.dropDownClassName}
        menuClassName={this.props.menuClassName}
        buttonClassName={this.props.buttonClassName}
        titlePrefix={this.props.titlePrefix}
        autocompleteFilter={this.props.autocompleteFilter || fuzzy}
        actionItems={this.props.actionItems}
        items={this.state.items}
        onChange={this.onChange}
        selectedKey={this.props.selectedKey}
        title={this.props.title || this.state.title}
        autocompletePlaceholder={this.props.placeholder}
        userSettingsPrefix={this.props.userSettingsPrefix}
        storageKey={this.props.storageKey}
        disabled={this.props.disabled}
      />
    );
  }
}

export default withTranslation()(ResourceDropdown);
