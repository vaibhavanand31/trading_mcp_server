import type z from "zod";
import type { MarketDataSchema } from "../../server/schema";
import { getIndicators } from "../lighter/stockData";
import type { MARKETS } from "../utils/markets";
import { getCandleStick, getLatestPrice } from "../lighter/candleStick";

export async function getMarketData(symbol: keyof typeof MARKETS, duration: '5m' | '4h'): Promise<z.infer<typeof MarketDataSchema>> {
    const stockData = await getIndicators(symbol, duration)
    const candleSticks = await getCandleStick(symbol, duration)
    const latestPrice = await getLatestPrice(candleSticks)

    if (!latestPrice)
        throw new Error("Latest price cannot be undefined")

    return {
        ...stockData,
        latestPrice,
        symbol: symbol
    }
}
