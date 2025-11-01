export const MARKETS = {
    "BTC": {
        "marketId": 1,
        "priceDecimals": 10,
        "qtyDecimals": 100000,
        "clientOrderIndex": 0
    },
    "ETH": {
        "marketId": 0,
        "priceDecimals": 100,
        "qtyDecimals": 10000,
        "clientOrderIndex": 1
    },
    "SOL": {
        "marketId": 2,
        "priceDecimals": 1000,
        "qtyDecimals": 1000,
        "clientOrderIndex": 2
    },
    "HYPE": {
        "marketId": 24,
        "priceDecimals": 10000,
        "qtyDecimals": 100,
        "clientOrderIndex": 3
    }
}

export enum SYMBOL {
    "BTC",
    "ETH",
    "HYPE",
    "SOL"
}