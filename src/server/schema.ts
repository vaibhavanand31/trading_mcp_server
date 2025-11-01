import z from "zod";

// Schema for the trading decision from LLM
export const TradingDecisionSchema = z.object({
    action: z.enum(['LONG', 'SHORT', 'HOLD', 'CLOSE_ALL']),
    confidence: z.number().min(0).max(1),
    reasoning: z.string(),
    quantity: z.number()
});

export type TradingDecision = z.infer<typeof TradingDecisionSchema>;

// Schema for market data
export const MarketDataSchema = z.object({
    symbol: z.string(),
    latestPrice: z.number(),
})

export const technicalIndicators = z.object({
    midPrices: z.array(z.number()),
    ema20s: z.array(z.number()),
    macd: z.array(z.number()),
})