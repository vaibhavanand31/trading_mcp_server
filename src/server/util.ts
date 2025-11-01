interface ToolResponse {
    content: Array<{ type: 'text'; text: string }>;
    isError?: boolean;
}

export const createToolResponse = (data: unknown, error?: Error) => ({
    content: [{
        type: 'text' as const,
        text: error
            ? JSON.stringify({ error: error.message, timestamp: new Date().toISOString() })
            : JSON.stringify(data, null, 2)
    }],
    isError: !!error
});

export const createLogger = (toolName: string) => ({
    info: (msg: string) => console.error(`[${toolName}] ℹ️  ${msg}`),
    error: (msg: string) => console.error(`[${toolName}] ❌ ${msg}`),
    debug: (msg: string) => console.error(`[${toolName}] 🐛 ${msg}`)
});