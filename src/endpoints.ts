import {APIClient, NameType} from '@wharfkit/antelope'
import {GetABISnapshotResponse, GetActionsResponse, GetCreatedAccountsResponse, GetCreatorResponse, GetLinksResponse, GetProposalsResponse, GetVotersResponse} from './types'

export class HyperionAPIClient {
    constructor(private client: APIClient) {}

    async get_abi_snapshot(contract: string, block?: number, fetch = false): Promise<GetABISnapshotResponse> {
        if (!block) {
            const info = await this.client.v1.chain.get_info()

            block = Number(info.last_irreversible_block_num)
        }

        return this.client.call({
            path: `/v2/history/get_abi_snapshot?contract=${encodeURIComponent(
                contract
            )}&block=${block}&fetch=${fetch}`,
            method: 'GET',
            responseType: GetABISnapshotResponse
        })
    }

    async get_voters(
        producer?: NameType,
        proxy?: boolean,
        skip?: number,
        limit?: number
    ): Promise<GetVotersResponse> {
        let queryParams = ''
        const queryParts: string[] = []

        if (producer) queryParts.push(`producer=${producer}`)
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

    async get_links(account?: NameType): Promise<GetLinksResponse> {
        const queryParams = account ? `?account=${account}` : '';
        
        return this.client.call({
            path: `/v2/state/get_links${queryParams}`,
            method: 'GET',
            responseType: GetLinksResponse,
        });
    }

    async get_proposals(options?: {
        proposer?: NameType,
        proposal?: NameType,
        account?: NameType,
        requested?: string,
        provided?: string,
        track?: number | boolean,
        skip?: number,
        limit?: number
    }): Promise<GetProposalsResponse> {
        const queryParts: string[] = [];

        for (const [key, value] of Object.entries(options || {})) {
            queryParts.push(`${key}=${value}`);
        }

        const queryParams = queryParts.length ? '?' + queryParts.join('&') : '';

        return this.client.call({
            path: `/v2/state/get_proposals${queryParams}`,
            method: 'GET',
            responseType: GetProposalsResponse,
        });
    }

    async get_actions(account: string, options?: {
        filter?: string,
        skip?: number,
        limit?: number,
        sort?: string,
        after?: string,
        before?: string,
        transfer_to?: string,
        transfer_from?: string,
        transfer_symbol?: string,
        act_name?: string,
        act_account?: string
    }): Promise<GetActionsResponse> {
        const queryParts: string[] = [`account=${account}`];
    
        for (const [key, value] of Object.entries(options || {})) {
            queryParts.push(`${key}=${value}`);
        }
    
        const queryParams = queryParts.length ? '?' + queryParts.join('&') : '';
    
        return this.client.call({
            path: `/v2/history/get_actions${queryParams}`,
            method: 'GET',
            responseType: GetActionsResponse,
        });
    }

    async get_created_accounts(account: string): Promise<GetCreatedAccountsResponse> {
        return this.client.call({
            path: `/v2/history/get_created_accounts?account=${account}`,
            method: 'GET',
            responseType: GetCreatedAccountsResponse,
        });
    }

    async get_creator(account: string): Promise<GetCreatorResponse> {
        return this.client.call({
            path: `/v2/history/get_creator?account=${account}`,
            method: 'GET',
            responseType: GetCreatorResponse,
        });
    }
}
