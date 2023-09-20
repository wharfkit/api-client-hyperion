import {assert} from 'chai'

import {APIClient, FetchProvider} from '@wharfkit/antelope'
import {mockFetch} from '@wharfkit/mock-data'

import {HyperionAPIClient, Types} from '$lib'

const ABIResponse = {
  // Add mock data that mimics the actual ABI snapshot structure
};

const client = new APIClient({
    provider: new FetchProvider('https://eos.hyperion.eosrio.io/', {fetch: mockFetch}),
})

const hyperion = new HyperionAPIClient(client)

suite('Hyperion API', function () {
    this.slow(200)
    this.timeout(10 * 10000)

    test('get_abi_snapshot', async function () {
        const response = await hyperion.get_abi_snapshot("eosio.token", 2000, true);
        assert.deepEqual(response, {
            "block_num": null,
            "error": "abi not found for eosio.token until block 2000",
            "last_indexed_block": 331963268,
            "last_indexed_block_time": "2023-09-20T00:35:04.500",
            "present": false,
            "query_time_ms": 4,
        });
    })

    test('get_voters', async function () {
        const response = await hyperion.get_voters('eoscafeblock', true, 100, 200);
        assert.equal(response.voters.length, 24);
        assert(response.voters[0].account.equals('killc.ftw'));
        assert(response.voters[0].weight.equals(20161076275.827435));
        assert(response.voters[0].last_vote.equals(297527904));
    });
})
