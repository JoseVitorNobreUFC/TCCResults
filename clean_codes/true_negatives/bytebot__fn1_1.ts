// @ts-nocheck
function convertJsonSchemaToGoogleSchema(schema: any): any {
  if (!schema) return {};
  const result: any = {
    type: jsonSchemaTypeToGoogleType(schema.type),
  };
  if (schema.description) {
    result.description = schema.description;
  }
  if (schema.type === 'string' && schema.enum && Array.isArray(schema.enum)) {
    result.enum = schema.enum;
  }
  if (schema.nullable) {
    result.nullable = true;
  }
  if (schema.type === 'array' && schema.items) {
    result.items = convertJsonSchemaToGoogleSchema(schema.items);
  }
  if (schema.type === 'object' && schema.properties) {
    result.properties = {};
    for (const [key, value] of Object.entries(schema.properties)) {
      result.properties[key] = convertJsonSchemaToGoogleSchema(value);
    }
    if (schema.required) {
      result.required = schema.required;
    }
  }
  return result;
}