import {ABI, APIClient} from '@wharfkit/antelope'
import {GetVotersResponse} from './types'

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

    async get_voters(
        producer?: string,
        proxy?: boolean,
        skip?: number,
        limit?: number
    ): Promise<GetVotersResponse> {
        let queryParams = ''
        const queryParts: string[] = []

        if (producer) queryParts.push(`producer=${encodeURIComponent(producer)}`)
        if (proxy !== undefined) queryParts.push(`proxy=${proxy}`)
        if (skip !== undefined) queryParts.push(`skip=${skip}`)
        if (limit !== undefined) queryParts.push(`limit=${limit}`)

        queryParams = queryParts.length ? '?' + queryParts.join('&') : ''

        return this.client.call({
            path: `/v2/state/get_voters${queryParams}`,
            method: 'GET',
            responseType: GetVotersResponse,
        })
    }
}
