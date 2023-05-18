import { k8sPatch } from '@openshift-console/dynamic-plugin-sdk';

import { createTopologyResourceConnection, getTopologyResourceObject } from '../utils';
import { sampleDeployments } from '../utils/__tests__/test-resource-data';
import { OdcNodeModel } from '../utils/types/topology-types';

import { topologyDataModel } from './topology-test-data';

let patchData = null;

describe('Topology Utils', () => {
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.fn(k8sPatch).mockImplementation(({ data }) => {
      patchData = data;
      return Promise.resolve();
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should create topology visual connector', async (done) => {
    const source = (topologyDataModel.nodes[0] as OdcNodeModel).resource;
    const target = (topologyDataModel.nodes[1] as OdcNodeModel).resource;
    await createTopologyResourceConnection(source, target, null).catch(() => {
      // Expected, network request failure for update
    });
    const expectedConnectsToValue = [
      target.metadata.labels['app.kubernetes.io/instance'],
      {
        apiVersion: target.apiVersion,
        kind: target.kind,
        name: target.metadata.name,
      },
    ];
    const expectedPatchData = {
      op: 'replace',
      path: '/metadata/annotations',
      value: {
        'app.openshift.io/connects-to': JSON.stringify(expectedConnectsToValue),
      },
    };

    expect(patchData[0]).toEqual(expectedPatchData);
    done();
  });

  it('should return topology resource object', () => {
    const topologyResourceObject = getTopologyResourceObject(topologyDataModel.nodes[0].data);
    expect(topologyResourceObject).toEqual(sampleDeployments.data[0]);
  });
});
