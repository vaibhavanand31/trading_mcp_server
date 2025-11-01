import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getCandleStick, getLatestPrice } from "../lighter/candleStick";
import { getOpenPositions } from "../lighter/openPositions";
import { getIndicators } from "../lighter/stockData";
import { account } from "../lighter/account";

export const MARKET_SYMBOLS = ['BTC', 'ETH', 'SOL', 'HYPE'] as const;

export type MarketSymbol = typeof MARKET_SYMBOLS[number];

export async function generatePromptForLLM(symbol: string): Promise<string> {
  const positions = await getOpenPositions(account);

  // Step 1: Fetch market data and latest price
  const candleSticks = await getCandleStick(symbol as MarketSymbol, '1m');
  const marketData = await getLatestPrice(candleSticks);

  // Step 2: Fetch technical indicators (5m)
  const indicators5m = await getIndicators(symbol as MarketSymbol, '5m');
  const indicators4H = await getIndicators(symbol as MarketSymbol, '4h');

  // Step 3: Construct prompt for LLM with strict output constraint
  const prompt = `
  You are an expert trading analyst. Analyze the following data for symbol "${symbol}".
  
  Available capital: $50
  Current Price: ${marketData}
  Technical Indicators (5m):
  - MACD: ${indicators5m.macd.join(', ')}
  - EMA20: ${indicators5m.ema20s.join(', ')}
  
   Technical Indicators (4h):
  - MACD: ${indicators4H.macd.join(', ')}
  - EMA20: ${indicators4H.ema20s.join(', ')}

  Current Open Positions: ${JSON.stringify(positions)}
  
  Based on this information, recommend one trade action: LONG, SHORT, HOLD, or CLOSE_ALL.
  Confidence level must be a decimal between 0 and 1.
  Quantity should reflect the trade size.
  
  Note:
  - Only one position can be open at a time.
  - Opening a LONG or SHORT position closes any existing positions.
  
  generate ONLY a JSON object as plain text with the exact keys:
  {
    "symbol": "${symbol}",
    "action": "<LONG|SHORT|HOLD|CLOSE_ALL>",
    "confidence": <0-1>,
    "reasoning": "<detailed reasoning>",
    "quantity": <decimal value greater than 0>
  }
  
  Do NOT include any explanations, text, comments, or formatting outside the JSON object.
  If unable to provide a recommendation, return an empty JSON {}.

  once the json is generated call execute_trade with json object.
  `;

  return prompt
}