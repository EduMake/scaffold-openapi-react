/**
 * Parser for OpenAPI 3.1 schemas.
 * Fetches the schema from a URL and extracts endpoint metadata.
 */
export interface OpenAPISchema {
    endpoints: EndpointInfo[];
    title: string;
    description: string;
    version: string;
    apiUrl: string;
    components: Record<string, Record<string, unknown>>;
}
export interface EndpointInfo {
    path: string;
    method: string;
    operationId: string;
    summary?: string;
    description?: string;
    parameters: ParameterInfo[];
    requestBody?: RequestBodyInfo;
    responses: ResponseInfo;
    tags?: string[];
}
export interface ParameterInfo {
    name: string;
    in: 'path' | 'query' | 'header';
    required: boolean;
    schema: Record<string, unknown>;
    description?: string;
}
export interface RequestBodyInfo {
    required: boolean;
    content: Record<string, {
        schema: Record<string, unknown>;
    }>;
}
export interface ResponseInfo {
    [statusCode: string]: {
        description: string;
        content?: Record<string, {
            schema: Record<string, unknown>;
        }>;
    };
}
export declare function parseOpenAPI(schemaUrl: string): Promise<OpenAPISchema>;
