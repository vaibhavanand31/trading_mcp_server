import { NonceManagerType } from "../../lighter-sdk-ts/nonce_manager";
import { SignerClient } from "../../lighter-sdk-ts/signer";
import type { Account } from "../../types/account";
import { BASE_URL } from "../../config";
import { MARKETS } from "./../utils/markets";
import { getCandleStick, getLatestPrice } from "./candleStick";

export async function createPosition(account: Account, symbol: string, side: "LONG" | "SHORT", quantity: number) {
    const client = await SignerClient.create({
        url: BASE_URL,
        privateKey: account.apiKey,
        apiKeyIndex: account.apiKeyIndex,
        accountIndex: Number(account.accountIndex),
        nonceManagementType: NonceManagerType.API
    });

    const market = MARKETS[symbol as keyof typeof MARKETS];
    const candleStickData = await getCandleStick(symbol, '1m')
    const latestPrice = getLatestPrice(candleStickData)
    if (!latestPrice) {
        throw new Error("No latest price found");
    }
    const response = await client.createOrder({
        marketIndex: market.marketId,
        clientOrderIndex: market.clientOrderIndex,
        baseAmount: quantity * market.qtyDecimals,
        price: (side == "LONG" ? latestPrice * 1.01 : latestPrice * 0.99) * market.priceDecimals,
        isAsk: side == "LONG" ? false : true,
        orderType: SignerClient.ORDER_TYPE_MARKET,
        timeInForce: SignerClient.ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL,
        reduceOnly: 0,
        triggerPrice: SignerClient.NIL_TRIGGER_PRICE,
        orderExpiry: SignerClient.DEFAULT_IOC_EXPIRY,
    });
    console.log(response);
}