import { SubStateMachine } from 'db://assets/Base/SubStateMachine'
import { StateMachine } from 'db://assets/Base/StateMachine'
import {
  DIRECTION_ENUM,
  DIRECTION_ORDER_ENUM,
  PARAMS_NAME_ENUM,
  SPIKE_COUNT_ENUM,
  SPIKE_COUNT_MAP_NUMBER_ENUM,
} from 'db://assets/Enums'
import State from 'db://assets/Base/State'
import { AnimationClip } from 'cc'
import DirectionSubStateMachine from 'db://assets/Base/DirectionSubStateMachine'
import SpikesSubStateMachine from 'db://assets/Script/Spikes/SpikesSubStateMachine'

const BASE_URL = 'texture/spikes/spikestwo'

export default class SpikesTowSubStateMachine extends SpikesSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(SPIKE_COUNT_ENUM.ZERO, new State(fsm, `${BASE_URL}/zero`))
    this.stateMachines.set(SPIKE_COUNT_ENUM.ONE, new State(fsm, `${BASE_URL}/one`))
    this.stateMachines.set(SPIKE_COUNT_ENUM.TWO, new State(fsm, `${BASE_URL}/two`))
    this.stateMachines.set(SPIKE_COUNT_ENUM.THREE, new State(fsm, `${BASE_URL}/three`))
  }
}