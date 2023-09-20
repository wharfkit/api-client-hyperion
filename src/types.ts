import {Float64, Name, Struct, UInt32} from '@wharfkit/antelope'

@Struct.type('voter')
export class Voter extends Struct {
    @Struct.field('name') declare account: Name
    @Struct.field('float64') declare weight: Float64
    @Struct.field('uint32') declare last_vote: UInt32
}

@Struct.type('get_voters_response')
export class GetVotersResponse extends Struct {
    @Struct.field(Voter, {array: true}) declare voters: Voter[]
}
