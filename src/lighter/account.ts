import type { Account } from "../../types/account";

export const account: Account = {
    apiKey: process.env.PRIVATE_API_KEY ?? "",
    accountIndex: process.env.ACCOUNT_INDEX ?? "",
    apiKeyIndex: Number(process.env.API_KEY_INDEX) ?? 2
}