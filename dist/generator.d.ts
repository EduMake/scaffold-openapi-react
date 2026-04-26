/**
 * Generator creates a complete React app from parsed OpenAPI schema.
 * All generated code is designed to be edited freely by the developer.
 */
import { OpenAPISchema } from './parser.js';
export declare function generateApp(schema: OpenAPISchema, outputDir: string, appName: string, _apiUrl: string): Promise<void>;
