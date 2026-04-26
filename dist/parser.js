/**
 * Parser for OpenAPI 3.1 schemas.
 * Fetches the schema from a URL and extracts endpoint metadata.
 */
export async function parseOpenAPI(schemaUrl) {
    const response = await fetch(schemaUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch OpenAPI schema: ${response.status} ${response.statusText}`);
    }
    const spec = (await response.json());
    if (!spec.openapi) {
        throw new Error('Invalid OpenAPI schema: missing "openapi" field');
    }
    const openApiVersion = spec.openapi;
    if (!openApiVersion.startsWith('3.1')) {
        console.warn(`⚠️  Schema version is ${openApiVersion}, this tool targets 3.1. Results may vary.`);
    }
    const endpoints = [];
    const paths = (spec.paths || {});
    const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];
    for (const [pathKey, pathItem] of Object.entries(paths)) {
        // Skip internal/docs paths
        if (pathKey.startsWith('/docs') || pathKey.startsWith('/redoc') || pathKey.startsWith('/openapi')) {
            continue;
        }
        for (const method of httpMethods) {
            if (!(method in pathItem))
                continue;
            const operation = pathItem[method];
            if (operation.deprecated === true)
                continue;
            const operationId = operation.operationId ||
                `${method}${pathKey.replace(/[^a-zA-Z0-9]/g, '_')}`;
            const parameters = [];
            for (const param of operation.parameters || []) {
                const p = param;
                parameters.push({
                    name: p.name,
                    in: p.in,
                    required: p.required || false,
                    schema: p.schema || {},
                    description: p.description,
                });
            }
            const rawBody = operation.requestBody;
            const requestBody = rawBody
                ? {
                    required: rawBody.required || false,
                    content: rawBody.content || {},
                }
                : undefined;
            endpoints.push({
                path: pathKey,
                method: method.toUpperCase(),
                operationId,
                summary: operation.summary,
                description: operation.description,
                parameters,
                requestBody,
                responses: (operation.responses || {}),
                tags: operation.tags,
            });
        }
    }
    const info = (spec.info || {});
    const servers = (spec.servers || []);
    const components = (spec.components?.schemas || {});
    return {
        endpoints,
        title: info.title || 'Generated App',
        description: info.description || '',
        version: info.version || '1.0.0',
        apiUrl: servers.length > 0 ? servers[0].url : '',
        components,
    };
}
//# sourceMappingURL=parser.js.map