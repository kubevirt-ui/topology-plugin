import findKey from 'lodash.findkey';
import get from 'lodash.get';
import memoize from 'lodash.memoize';
import toPath from 'lodash.topath';

import { modelToRef } from '@kubevirt-ui/kubevirt-api/console';
import { K8sKind, K8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { SwaggerDefinition, SwaggerDefinitions } from '@topology-utils/types/swagger-types';

export const getDefinitionKey = memoize(
  (model: K8sModel, definitions: SwaggerDefinitions): string => {
    return findKey(definitions, (def: SwaggerDefinition) => {
      return def['x-kubernetes-group-version-kind']?.some(({ group, version, kind }) => {
        return (
          (model?.apiGroup ?? '') === (group || '') &&
          model?.apiVersion === version &&
          model?.kind === kind
        );
      });
    });
  },
  modelToRef,
);

let swaggerDefinitions: SwaggerDefinitions;
export const getSwaggerDefinitions = (): SwaggerDefinitions => swaggerDefinitions;

const getRef = (definition: SwaggerDefinition): string => {
  const ref = definition.$ref || get(definition, 'items.$ref');
  const re = /^#\/definitions\//;
  // Only follow JSON pointers, not external URI references.
  return ref && re.test(ref) ? ref.replace(re, '') : null;
};

// Get the path in the swagger document to additional property details.
// This can be
// - A reference to another top-level definition
// - Inline property declarations
// - Inline property declarations for array items
export const getSwaggerPath = (
  allProperties: SwaggerDefinitions,
  currentPath: string[],
  name: string,
  followRef: boolean,
): string[] => {
  const nextPath = [...currentPath, 'properties', name];
  const definition = get(allProperties, nextPath) as SwaggerDefinition;
  if (!definition) {
    return null;
  }
  const ref = getRef(definition);
  return followRef && ref ? [ref] : nextPath;
};

const findDefinition = (kindObj: K8sKind, propertyPath: string[]): SwaggerDefinition => {
  if (!swaggerDefinitions) {
    return null;
  }

  const rootPath = getDefinitionKey(kindObj, swaggerDefinitions);
  const path = propertyPath.reduce(
    (currentPath: string[], nextProperty: string, i: number): string[] => {
      if (!currentPath) {
        return null;
      }
      // Don't follow the last reference since the description is not as good.
      const followRef = i !== propertyPath.length - 1;
      return getSwaggerPath(swaggerDefinitions, currentPath, nextProperty, followRef);
    },
    [rootPath],
  );

  return path ? (get(swaggerDefinitions, path) as SwaggerDefinition) : null;
};

export const getPropertyDescription = (
  kindObj: K8sKind,
  propertyPath: string | string[],
): string => {
  const path: string[] = toPath(propertyPath);
  const definition = findDefinition(kindObj, path);
  return definition ? definition.description : null;
};

export const getResourceDescription = memoize((kindObj: K8sKind): string => {
  if (!swaggerDefinitions) {
    return null;
  }
  const key = getDefinitionKey(kindObj, swaggerDefinitions);
  return get(swaggerDefinitions, [key, 'description']);
}, modelToRef);
