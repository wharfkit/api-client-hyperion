import {
    APIClient,
    Asset,
    Checksum256Type,
    Int64Type,
    NameType,
    PublicKeyType,
    TimePointType,
    UInt64Type,
} from '@wharfkit/antelope'
import {
    V1,
    V2,
    SortType,
} from './types'

export class HyperionAPIClient  {
    public v1: HyperionV1APIClient;
    public v2: HyperionV2APIClient;

    constructor(private client: APIClient) {
        this.v1 = new HyperionV1APIClient(client);
        this.v2 = new HyperionV2APIClient(client);
    }
}

export class HyperionV1APIClient {
    constructor(private client: APIClient) {}
    
    async get_actions(options: {
        account_name: NameType
        pos?: UInt64Type;
        offset?: UInt64Type;
        filter?: UInt64Type;
        sort?: SortType;
        after?: TimePointType;
        before?: TimePointType;
        parent?: number;
    }): Promise<any> {
        return this.client.call({
            path: `/v1/history/get_actions`,
            method: 'POST',
            // responseType: GetActionsResponse,
            params: options
        })
    }
}

export class HyperionV2APIClient {
    constructor(private client: APIClient) {}

    async get_abi_snapshot(
        contract: string,
        block?: number,
        fetch = false
    ): Promise<V2.GetABISnapshotResponse> {
        if (!block) {
            const info = await this.client.v1.chain.get_info()

            block = Number(info.last_irreversible_block_num)
        }

        return this.client.call({
            path: `/v2/history/get_abi_snapshot?contract=${encodeURIComponent(
                contract
            )}&block=${block}&fetch=${fetch}`,
            method: 'GET',
            responseType: V2.GetABISnapshotResponse,
        })
    }

    async get_voters(
        producer?: NameType,
        proxy?: boolean,
        skip?: number,
        limit?: number
    ): Promise<V2.GetVotersResponse> {
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
            responseType: V2.GetVotersResponse,
        })
    }

    async get_links(account?: NameType): Promise<V2.GetLinksResponse> {
        const queryParams = account ? `?account=${account}` : ''

        return this.client.call({
            path: `/v2/state/get_links${queryParams}`,
            method: 'GET',
            responseType: V2.GetLinksResponse,
        })
    }

    async get_proposals(options?: {
        proposer?: NameType
        proposal?: NameType
        account?: NameType
        requested?: string
        provided?: string
        track?: number | boolean
        skip?: number
        limit?: number
    }): Promise<V2.GetProposalsResponse> {
        const queryParts: string[] = []

        for (const [key, value] of Object.entries(options || {})) {
            queryParts.push(`${key}=${value}`)
        }

        const queryParams = queryParts.length ? '?' + queryParts.join('&') : ''

        return this.client.call({
            path: `/v2/state/get_proposals${queryParams}`,
            method: 'GET',
            responseType: V2.GetProposalsResponse,
        })
    }

    async get_actions(
        account: NameType,
        options?: {
            filter?: string
            skip?: number
            limit?: number
            sort?: string
            after?: string
            before?: string
            transfer_to?: NameType
            transfer_from?: NameType
            transfer_symbol?: Asset.Symbol
            act_name?: string
            act_account?: NameType
        }
    ): Promise<V2.GetActionsResponse> {
        const queryParts: string[] = [`account=${account}`]

        for (const [key, value] of Object.entries(options || {})) {
            queryParts.push(`${key}=${value}`)
        }

        const queryParams = queryParts.length ? '?' + queryParts.join('&') : ''

        return this.client.call({
            path: `/v2/history/get_actions${queryParams}`,
            method: 'GET',
            responseType: V2.GetActionsResponse,
        })
    }

    async get_created_accounts(account: NameType): Promise<V2.GetCreatedAccountsResponse> {
        return this.client.call({
            path: `/v2/history/get_created_accounts?account=${account}`,
            method: 'GET',
            responseType: V2.GetCreatedAccountsResponse,
        })
    }

    async get_creator(account: NameType): Promise<V2.GetCreatorResponse> {
        return this.client.call({
            path: `/v2/history/get_creator?account=${account}`,
            method: 'GET',
            responseType: V2.GetCreatorResponse,
        })
    }

    async get_deltas(
        code: NameType,
        scope: NameType,
        table: NameType,
        payer: NameType
    ): Promise<V2.GetDeltasResponse> {
        return this.client.call({
            path: `/v2/history/get_deltas?code=${code}&scope=${scope}&table=${table}&payer=${payer}`,
            method: 'GET',
            responseType: V2.GetDeltasResponse,
        })
    }

    async get_table_state(
        code: NameType,
        table: NameType,
        block_num: Int64Type,
        after_key = ''
    ): Promise<V2.GetTableStateResponse> {
        return this.client.call({
            path: `/v2/history/get_table_state?code=${code}&table=${table}&block_num=${block_num}&after_key=${after_key}`,
            method: 'GET',
            responseType: V2.GetTableStateResponse,
        })
    }

    async get_key_accounts(public_key: PublicKeyType): Promise<V2.GetKeyAccountsResponse> {
        return this.client.call({
            path: `/v2/state/get_key_accounts?public_key=${public_key}`,
            method: 'GET',
            responseType: V2.GetKeyAccountsResponse,
        })
    }

    async get_tokens(account: NameType): Promise<V2.GetTokensResponse> {
        return this.client.call({
            path: `/v2/state/get_tokens?account=${account}`,
            method: 'GET',
            responseType: V2.GetTokensResponse,
        })
    }

    async get_transaction(id: Checksum256Type): Promise<V2.GetTransactionResponse> {
        return this.client.call({
            path: `/v2/history/get_transaction?id=${id}`,
            method: 'GET',
            responseType: V2.GetTransactionResponse,
        })
    }
}
