import React from 'react';
import { Provider } from 'react-redux';
import { mount, ReactWrapper } from 'enzyme';

import { useURLPoll } from '@openshift-console/dynamic-plugin-sdk-internal';

import TopologyDataRenderer from '../components/page/TopologyDataRenderer';
import DataModelProvider from '../data-transforms/DataModelProvider';
import TopologyDataRetriever from '../data-transforms/TopologyDataRetriever';
import { TopologyViewType } from '../utils/types/topology-types';

jest.mock('@console/plugin-sdk/src/api/useExtensions', () => ({
  useExtensions: () => [],
}));
jest.mock('@console/shared', () => {
  const ActualShared = jest.requireActual('@console/shared');
  return {
    ...ActualShared,
    useQueryParams: () => new Map(),
  };
});

type Props = {
  className?: string;
};

describe('DataModelProvider', () => {
  let wrapper: ReactWrapper<Props>;
  const spyUseURLPoll = jest.fn(useURLPoll);

  beforeEach(() => {
    spyUseURLPoll.mockReturnValue([{}, null, false]);
    wrapper = mount(
      <DataModelProvider namespace="test-project">
        <TopologyDataRenderer viewType={TopologyViewType.graph} />
      </DataModelProvider>,
      {
        wrappingComponent: ({ children }) => <Provider store={store}>{children}</Provider>,
      },
    );
  });

  it('should render inner components', () => {
    expect(wrapper.find(TopologyDataRetriever)).toHaveLength(1);
    expect(wrapper.find(TopologyDataRenderer)).toHaveLength(1);
  });
});
