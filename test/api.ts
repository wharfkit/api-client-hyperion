import {assert} from 'chai'

import {APIClient, Checksum256, FetchProvider, Float64, Name, UInt64} from '@wharfkit/antelope'
import {mockFetch} from '@wharfkit/mock-data'

import {HyperionAPIClient, Types} from '$lib'

const client = new APIClient({
    provider: new FetchProvider('https://wax.blokcrafters.io/', {fetch: mockFetch}),
})

const hyperion = new HyperionAPIClient(client)

suite('Hyperion API', function () {
    this.slow(200)
    this.timeout(10 * 10000)

    suite('v2', function () {
        test('get_health', async function () {
            const response = await hyperion.v2.get_health()

            assert.instanceOf(response, Types.v2.GetHealthResponse)
            assert.equal(response.host, 'wax.blokcrafters.io')
            assert.equal(response.version, '3.3.9-8')
            assert.equal(response.version_hash, 'fb2fc20d1d0e0700d29865a57527b8fbd4cc30a2')
            assert.equal(response.features.tables.proposals, true)
        })
        suite('state', function () {
            test('get_voters', async function () {
                const response = await hyperion.v2.state.get_voters('teamgreymass', true, 100, 200)

                assert.instanceOf(response, Types.v2.GetVotersResponse)
                assert.equal(response.voters.length, 100)
                assert.instanceOf(response.voters[0].account, Name)
                assert.equal(String(response.voters[0].account), 'ydeqk.wam')
                assert.equal(Number(response.voters[0].weight), 4.9849102353891966e39)
                assert.equal(Number(response.voters[0].last_vote), 290668173)
            })

            test('get_links', async function () {
                const response = await hyperion.v2.state.get_links('teamgreymass')

                assert.instanceOf(response, Types.v2.GetLinksResponse)
                assert.isArray(response.links)
                assert.equal(response.links.length, 10)
                assert.instanceOf(response.links[0].account, Name)
            })

            test('get_proposals', async function () {
                const response = await hyperion.v2.state.get_proposals({
                    skip: 1,
                    limit: 10,
                })

                assert.instanceOf(response, Types.v2.GetProposalsResponse)
                assert.isArray(response.proposals)
                assert.equal(response.proposals.length, 10)
                assert.instanceOf(response.proposals[0].proposer, Name)
            })

            test('get_key_accounts', async function () {
                const response = await hyperion.v2.state.get_key_accounts(
                    'EOS8KmhygTrrvtW7zJd6HXWrNqA5WX9NzScZ37JyXRiwpiJN2g2rR'
                )

                assert.instanceOf(response, Types.v2.GetKeyAccountsResponse)
                assert.equal(response.account_names.length, 1)
                assert.instanceOf(response.account_names[0], Name)
                assert.equal(String(response.account_names[0]), 'teamgreymass')
            })

            test('get_tokens', async function () {
                const response = await hyperion.v2.state.get_tokens('teamgreymass')

                assert.instanceOf(response, Types.v2.GetTokensResponse)
                assert.instanceOf(response.account, Name)
                assert.equal(response.tokens.length, 4)
                assert.instanceOf(response.tokens[0].amount, Float64)
            })

            test('get_account', async function () {
                const response = await hyperion.v2.state.get_account('teamgreymass')

                assert.instanceOf(response, Types.v2.GetAccountResponse)
                assert.instanceOf(response.account.account_name, Name)
                assert.equal(response.tokens.length, 4)
                assert.instanceOf(response.tokens[0].amount, Float64)
                assert.equal(Number(response.total_actions), 1885932)
            })
        })

        suite('history', function () {
            test('get_abi_snapshot', async function () {
                const response = await hyperion.v2.history.get_abi_snapshot(
                    'eosio.token',
                    2000,
                    true
                )

                assert.instanceOf(response, Types.v2.GetABISnapshotResponse)
                assert.equal(response.abi.version, 'eosio::abi/1.1')
            })

            test('get_actions', async function () {
                const response = await hyperion.v2.history.get_actions('teamgreymass', {
                    filter: 'eosio.token:*',
                    skip: 100,
                    limit: 5,
                })

                assert.instanceOf(response, Types.v2.GetActionsResponse)
                assert.isArray(response.actions)
                assert.equal(response.actions.length, 5)
                assert.instanceOf(response.actions[0].act.name, Name)
                assert.instanceOf(response.actions[0].act.authorization[0].actor, Name)
                assert.isArray(response.actions[0].receipts)
                assert.instanceOf(response.actions[0].global_sequence, UInt64)
                assert.instanceOf(response.actions[0].producer, Name)
                assert.instanceOf(response.actions[0].action_ordinal, UInt64)
                assert.instanceOf(response.actions[0].creator_action_ordinal, UInt64)
            })

            test('get_transaction', async function () {
                const response = await hyperion.v2.history.get_transaction(
                    'a51a3cc53b2ff5d5b25ad44b1e3ef5f796ce3ca60101ea05b3be64e68b684ccb'
                )

                assert.instanceOf(response, Types.v2.GetTransactionResponse)
                assert.instanceOf(response.trx_id, Checksum256)
                assert.equal(response.actions.length, 5)
                assert.instanceOf(response.actions[0].act.name, Name)
            })

            test('get_deltas', async function () {
                const response = await hyperion.v2.history.get_deltas(
                    'eosio.token',
                    'teamgreymass',
                    'accounts',
                    'teamgreymass'
                )

                assert.instanceOf(response, Types.v2.GetDeltasResponse)
                assert.equal(response.deltas.length, 10)
                assert.instanceOf(response.deltas[0].code, Name)
            })

            test('get_table_state', async function () {
                const response = await hyperion.v2.history.get_table_state(
                    'eosio.token',
                    'stat',
                    267000000
                )

                assert.instanceOf(response, Types.v2.GetTableStateResponse)
                assert.instanceOf(response.code, Name)
                assert.equal(response.results.length, 1)
            })

            test('get_created_accounts', async function () {
                const response = await hyperion.v2.history.get_created_accounts('teamgreymass')

                assert.instanceOf(response, Types.v2.GetCreatedAccountsResponse)
                assert.isArray(response.accounts)
                assert.equal(response.accounts.length, 4)
                assert.instanceOf(response.accounts[0].name, Name)
            })

            test('get_created_accounts (limit & skip)', async function () {
                const response = await hyperion.v2.history.get_created_accounts('gm', {
                    limit: 1,
                })

                assert.instanceOf(response, Types.v2.GetCreatedAccountsResponse)
                assert.isArray(response.accounts)
                assert.equal(response.accounts.length, 1)
                assert.instanceOf(response.accounts[0].name, Name)

                const firstName = response.accounts[0].name
                const response2 = await hyperion.v2.history.get_created_accounts('gm', {
                    limit: 1,
                    skip: 1,
                })

                assert.instanceOf(response2, Types.v2.GetCreatedAccountsResponse)
                assert.isArray(response2.accounts)
                assert.equal(response2.accounts.length, 1)
                assert.instanceOf(response2.accounts[0].name, Name)
                assert.notEqual(response2.accounts[0].name, firstName)
            })

            test('get_creator', async function () {
                const response = await hyperion.v2.history.get_creator('teamgreymass')

                assert.instanceOf(response, Types.v2.GetCreatorResponse)
                assert.instanceOf(response.creator, Name)
                assert.equal(String(response.creator), 'gqyqi.waa')
            })

            // test('get_creator eosio', async function () {
            //     const response = await hyperion.v2.history.get_creator('eosio')
            //
            //     assert.instanceOf(response, Types.v2.GetCreatorResponse)
            //     assert.instanceOf(response.creator, Name)
            //     assert.equal(String(response.creator), '__self__')
            //     assert.equal(String(response.trx_id), '')
            // })
        })
    })
})
