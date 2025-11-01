import { BASE_URL } from "../../config";
import type { Account } from "../../types/account";
import { AccountApi, ApiKeyAuthentication, IsomorphicFetchHttpLibrary, ServerConfiguration } from "../../lighter-sdk-ts/generated";

export async function getOpenPositions(account: Account) {
    const accountApi = new AccountApi({
        baseServer: new ServerConfiguration<{}>(BASE_URL, {}),
        httpApi: new IsomorphicFetchHttpLibrary(),
        middleware: [],
        authMethods: {
            apiKey: new ApiKeyAuthentication(account.apiKey)
        }
    });

    const currentOpenOrders = await accountApi.accountWithHttpInfo(
        'index',
        account.accountIndex.toString()
    );

    return currentOpenOrders.data.accounts[0]?.positions.map((accountPosition) => ({
        symbol: accountPosition.symbol,
        position: accountPosition.position,
        sign: accountPosition.sign == 1 ? "LONG" : "SHORT",
        unrealizedPnl: accountPosition.unrealizedPnl,
        realizedPnl: accountPosition.realizedPnl,
        liquidationPrice: accountPosition.liquidationPrice
    }));
}