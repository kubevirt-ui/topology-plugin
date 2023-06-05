export type SwaggerDefinition = {
  definitions?: SwaggerDefinitions;
  description?: string;
  type?: string;
  enum?: string[];
  $ref?: string;
  items?: SwaggerDefinition;
  required?: string[];
  properties?: {
    [prop: string]: SwaggerDefinition;
  };
};

export type SwaggerDefinitions = {
  [name: string]: SwaggerDefinition;
};

export type SwaggerAPISpec = {
  swagger: string;
  info: { title: string; version: string };
  paths: { [path: string]: any };
  definitions: SwaggerDefinitions;
};
