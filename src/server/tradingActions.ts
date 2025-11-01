import { account } from "../lighter/account";
import { closePositions } from "../lighter/closePosition";
import { createPosition } from "../lighter/createPosition";
import type { TradingDecision } from "./schema";

export async function executeTradeAction(
  symbol: string,
  decision: TradingDecision
): Promise<string> {
  if (decision.confidence <= 0.7) {
    return "confidence is too low"
  }
  switch (decision.action) {
    case 'LONG':
      return await executeBuyOrder(symbol, decision);
    case 'SHORT':
      return await executeSellOrder(symbol, decision);
    case 'CLOSE_ALL':
      await closePositions(account);
      return `Closed all positions. Reasoning: ${decision.reasoning}`;
    case 'HOLD':
      return `Holding position for ${symbol}. Reasoning: ${decision.reasoning}`;
    default:
      throw new Error(`Unknown action: ${decision.action}`);
  }
}

async function executeBuyOrder(symbol: string, decision: TradingDecision) {
  // Implement your trading API call here
  console.log(`Executing LONG order for ${symbol}`)
  await closePositions(account);
  await createPosition(account, symbol, 'LONG', decision.quantity)
  // Return order confirmation
  return `BUY order executed for ${symbol}. Confidence: ${decision.confidence}`;
}

async function executeSellOrder(symbol: string, decision: TradingDecision) {
  // Implement your trading API call here
  await closePositions(account)
  await createPosition(account, symbol, 'SHORT', decision.quantity)
  return `SELL order executed for ${symbol}. Confidence: ${decision.confidence}`;
}
