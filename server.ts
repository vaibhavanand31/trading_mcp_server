import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { executeTradeAction } from "./src/server/tradingActions";
import z from "zod";
import { getIndicators } from "./src/lighter/stockData";
import { getCandleStick, getLatestPrice } from "./src/lighter/candleStick";
import { getOpenPositions } from "./src/lighter/openPositions";
import { generatePromptForLLM, MARKET_SYMBOLS, type MarketSymbol } from "./src/server/prompt";
import { createToolResponse } from "./src/server/util";
import { account } from "./src/lighter/account";

const SymbolSchema = z.enum(MARKET_SYMBOLS);
const PeriodSchema = z.enum(['5m', '4h']);

const server = new McpServer({
    name: "Trading MCP Server",
    version: "1.0.1",
    capabilities: {
        resources: {},
        tools: {},
    },
});

// ✅ Tool 1: Get matket data
server.tool(
    'get_market_data',
    {
        symbol: z.enum(MARKET_SYMBOLS).describe('Trading symbol'),
    },
    async ({ symbol }) => {
        try {
            const candleSticks = await getCandleStick(symbol as MarketSymbol, '1m');
            const latestPrice = await getLatestPrice(candleSticks);
            return createToolResponse(latestPrice)
        } catch (error) {
            return createToolResponse(null, error as Error)
        }
    }
);

// ✅ Tool 2: Get technical indicators
server.tool(
    'get_technical_indicators',
    {
        symbol: z.enum(MARKET_SYMBOLS).describe('Trading symbol'),
        period: z.enum(['5m', '4h']).describe('Time period')
    },
    async ({ symbol, period }) => {
        // Fix: Ensure symbol and period are typed correctly for getIndicators
        // getIndicators expects symbol: "BTC" | "ETH" | "SOL" | "HYPE"
        // Consider validating symbol and period here if needed
        try {
            const validSymbol = SymbolSchema.parse(symbol);
            const validPeriod = PeriodSchema.parse(period);
            const indicators = await getIndicators(validSymbol, validPeriod);
            return createToolResponse(indicators)
        } catch (e) {
            return createToolResponse(null, e as Error)
        }
    }
);

server.tool(
    'get_open_positions',
    async () => {
        try {
            const positions = await getOpenPositions(account);
            return createToolResponse(positions)
        } catch (e) {
            return createToolResponse(null, e as Error)
        }
    }
);

server.tool(
    'execute_trade',
    {
        symbol: z.enum(MARKET_SYMBOLS).describe('Trading symbol to analyze'),
        action: z.enum(['LONG', 'SHORT', 'HOLD', 'CLOSE_ALL']),
        confidence: z.number().min(0).max(1),
        reasoning: z.string(),
        quantity: z.number()
    },
    async ({ symbol, action, confidence, reasoning, quantity }) => {
        try {
            const decision = { action, confidence, reasoning, quantity }
            const response = await executeTradeAction(symbol, decision)
            return createToolResponse(response)
        } catch (e) {
            return createToolResponse(null, e as Error)
        }
    }
)

// ✅ Tool 4: Execute trade action (only after LLM decides)
server.tool(
    'request ai trading bot mcp server to execute gather data, analyse and execute the trade',
    {
        symbol: z.enum(MARKET_SYMBOLS).describe('Trading symbol to analyze'),
    },
    async ({ symbol }) => {
        try {
            const prompt = await generatePromptForLLM(symbol)
            return createToolResponse(prompt.trim())
        } catch (error) {
            return createToolResponse(null, error as Error)
        }
    }
);


// Expose trading guidelines as a resource
server.resource(
    'trading-guidelines',
    'trading://guidelines',
    {
        description: 'Guidelines the trading assistant must follow before executing trades.',
        mimeType: 'text/plain'
    },
    async () => ({
        contents: [
            {
                uri: 'trading://guidelines',
                text: `You are an expert trading analyst. When analyzing a symbol:
  
  1. ALWAYS call get_market_data first to understand current price action
  2. THEN call get_technical_indicators with appropriate time periods
  3. ALWAYS call get open positions first to understand current positions and holdings
  4. ANALYZE all data and decide: LONG, SHORT, or HOLD
  5. ONLY if you have high confidence (>0.7), call execute_trade
  6. ALWAYS explain your reasoning
  
  Risk Management:
  - Never recommend position sizing > 5% of portfolio per trade
  - Always set stop-loss levels
  - Consider maximum drawdown scenarios`
            }
        ]
    })
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Trading Analysis MCP Server ready');
}

main().catch(console.error);