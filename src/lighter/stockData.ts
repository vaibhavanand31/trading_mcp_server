import { getEma, getMacd, getMidPrices } from "./../utils/indicator";
import { CandlestickApi, IsomorphicFetchHttpLibrary, ServerConfiguration } from "../../lighter-sdk-ts/generated";
import { MARKETS, SYMBOL } from "../utils/markets";
const BASE_URL = "https://mainnet.zklighter.elliot.ai"

const klinesApi = new CandlestickApi({
    baseServer: new ServerConfiguration<{}>(BASE_URL, {}),
    httpApi: new IsomorphicFetchHttpLibrary(),
    middleware: [],
    authMethods: {}
});

export async function getIndicators(symbol: keyof typeof MARKETS, duration: "5m" | "4h"): Promise<{ midPrices: number[], macd: number[], ema20s: number[] }> {
    const marketId = MARKETS[symbol].marketId;
    const klines = await klinesApi.candlesticks(
        marketId,
        duration,
        Date.now() - 1000 * 60 * 60 * (duration === "5m" ? 2 : 96),
        Date.now(),
        50,
        false
    );
    const midPrices = getMidPrices(klines.candlesticks);
    const macd = getMacd(midPrices).slice(-10);
    const ema20s = getEma(midPrices, 20);

    return {
        midPrices: midPrices.slice(-10).map(x => Number(x.toFixed(3))),
        macd: macd.slice(-10).map(x => Number(x.toFixed(3))),
        ema20s: ema20s.slice(-10).map(x => Number(x.toFixed(3))),
    }
}