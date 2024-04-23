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

const BASE_URL = 'texture/spikes/spikesone'

export default class SpikesSubStateMachine extends DirectionSubStateMachine {
  run() {
    const value = this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT)
    this.currentState = this.stateMachines.get(SPIKE_COUNT_MAP_NUMBER_ENUM[value as number])
  }
}