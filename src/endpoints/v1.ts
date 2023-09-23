import { APIClient, NameType, TimePointType, UInt64Type } from "@wharfkit/antelope";
import { SortType } from "../types";

export class HyperionV1APIClient {
    public history: HyperionV1HistoryAPIClient;

    constructor(private client: APIClient) {
        this.history = new HyperionV1HistoryAPIClient(client);
    }
}

class HyperionV1HistoryAPIClient {
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