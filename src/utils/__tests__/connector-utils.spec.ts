import { DeploymentModel, modelToRef } from '@kubevirt-ui/kubevirt-api/console';
import {
  getGroupVersionKindForResource,
  k8sGet,
  k8sPatch,
} from '@openshift-console/dynamic-plugin-sdk';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { doConnectsToBinding, edgesFromAnnotations } from '@topology-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

jest.mock('@console/internal/module/k8s', () => ({
  k8sGet: jest.fn(),
  k8sPatch: jest.fn(),
  modelFor: jest.fn(),
  referenceFor: jest.fn(),
  referenceForModel: jest.fn(),
}));

const k8sGetMock = k8sGet as jest.Mock;
const k8sPatchMock = k8sPatch as jest.Mock;
const getK8sModelMock = getK8sModel as jest.Mock;
const modelToRefMock = modelToRef as jest.Mock;
const getGroupVersionKindForResourceMock = getGroupVersionKindForResource as jest.Mock;

describe('connector-hooks', () => {
  describe('edgeFromAnnotations hooks', () => {
    it('should return empty array if connects-to annotation is not present', () => {
      expect(edgesFromAnnotations({})).toEqual([]);
    });

    it('should return string value if connects-to anotation as single value', () => {
      expect(edgesFromAnnotations({ 'app.openshift.io/connects-to': 'abcd' })).toEqual(['abcd']);
    });

    it('should return array of values if connects-to anotation as multiple value', () => {
      expect(edgesFromAnnotations({ 'app.openshift.io/connects-to': 'abcd, mock, value' })).toEqual(
        ['abcd', 'mock', 'value'],
      );
    });
  });

  describe('doConnectsToBinding', () => {
    afterAll(() => {
      jest.resetAllMocks();
    });

    it('should fail when there is no context source', async () => {
      await expect(doConnectsToBinding([], '')).rejects.toBeInstanceOf(Error);
    });

    it('should patch annotation to target resource', async () => {
      const target = {
        metadata: {
          name: 'test-deployment',
          namespace: 'test',
        },
      } as K8sResourceKind;
      const mockResource = { metadata: { name: 'test-resource' } };
      getGroupVersionKindForResourceMock.mockReturnValue('apps/v1');
      modelToRefMock.mockReturnValue('apps/v1');
      k8sGetMock.mockReturnValue(mockResource);
      getK8sModelMock.mockReturnValue(DeploymentModel);

      await expect(doConnectsToBinding([target], 'apps/Deployment')).resolves.toBeTruthy();
      expect(k8sPatchMock).toHaveBeenCalledWith(DeploymentModel, mockResource, [
        expect.objectContaining({ op: 'add', path: '/metadata/annotations' }),
      ]);
    });

    it('should fail when context resource is not found', async () => {
      const target = {
        metadata: {
          name: 'test-deployment',
          namespace: 'test',
        },
      } as K8sResourceKind;
      getGroupVersionKindForResourceMock.mockReturnValue('apps/v1');
      modelToRefMock.mockReturnValue('apps/v1');
      k8sGetMock.mockReturnValue({});

      await expect(doConnectsToBinding([target], 'apps/Deployment')).rejects.toBeInstanceOf(Error);
    });
  });
});
