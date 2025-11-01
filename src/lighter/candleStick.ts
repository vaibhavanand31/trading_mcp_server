import { BASE_URL } from "../../config";
import { CandlestickApi, Candlesticks, IsomorphicFetchHttpLibrary, ServerConfiguration } from "../../lighter-sdk-ts/generated";
import { MARKETS } from "../utils/markets";


export async function getCandleStick(symbol: string, candleWidth: '1m' | '5m' | '4h' | '1d'): Promise<Candlesticks> {
    const candleStickApi = new CandlestickApi({
        baseServer: new ServerConfiguration<{}>(BASE_URL, {}),
        httpApi: new IsomorphicFetchHttpLibrary(),
        middleware: [],
        authMethods: {}
    });

    const market = MARKETS[symbol as keyof typeof MARKETS];
    let gap = 60 * 5
    switch (candleWidth) {
        case '4h':
            gap *= 100
            break
        case '1d':
            gap *= 1000
            break
        default:
            break;
    }

    return await candleStickApi.candlesticks(market.marketId, candleWidth, Date.now() - 1000 * 60 * 5, Date.now(), 1, false);
}

export const getLatestPrice = (candleStickData: Candlesticks) => candleStickData.candlesticks[candleStickData.candlesticks.length - 1]?.close;