import {ABI, APIClient} from '@wharfkit/antelope'

export class HyperionAPIClient {
    constructor(private client: APIClient) {}

    async get_abi_snapshot(contract: string, block?: number, fetch = false): Promise<ABI.Def> {
        if (!block) {
            const info = await this.client.v1.chain.get_info()

            block = Number(info.last_irreversible_block_num)
        }

        return this.client.call<ABI.Def>({
            path: `/v2/history/get_abi_snapshot?contract=${encodeURIComponent(
                contract
            )}&block=${block}&fetch=${fetch}`,
            method: 'GET',
        })
    }
}
