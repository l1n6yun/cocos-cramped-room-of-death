import { _decorator, Animation } from 'cc'
import {
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  PARAMS_NAME_ENUM,
  SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM,
} from 'db://assets/Enums'
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from 'db://assets/Base/StateMachine'
import TurnLeftSubStateMachine from 'db://assets/Script/Player/TurnLeftSubStateMachine'
import BlockFrontSubStateMachine from 'db://assets/Script/Player/BlockFrontSubStateMachine'
import { EntityManager } from 'db://assets/Base/EntityManager'
import BlockTurnLeftSubStateMachine from 'db://assets/Script/Player/BlockTurnLeftSubStateMachine'
import IdleSubStateMachine from 'db://assets/Script/WoodenSkeleton/IdleSubStateMachine'
import AttackSubStateMachine from 'db://assets/Script/WoodenSkeleton/AttackSubStateMachine'
import DeathSubStateMachine from 'db://assets/Script/WoodenSkeleton/DeathSubStateMachine'
import SpikesOneSubStateMachine from 'db://assets/Script/Spikes/SpikesOneSubStateMachine'
import SpikesTowSubStateMachine from 'db://assets/Script/Spikes/SpikesTowSubStateMachine'
import SpikesThreeSubStateMachine from 'db://assets/Script/Spikes/SpikesThreeSubStateMachine'
import SpikesFourSubStateMachine from 'db://assets/Script/Spikes/SpikesFourSubStateMachine'

const { ccclass, property } = _decorator


@ccclass('SpikesSkeletonStateMachine')
export class SpikesSkeletonStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.addComponent(Animation)

    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  private initParams() {
    this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, getInitParamsNumber())
  }

  private initStateMachines() {
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_ONE, new SpikesOneSubStateMachine(this))
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_TOW, new SpikesTowSubStateMachine(this))
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_THREE, new SpikesThreeSubStateMachine(this))
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_FOUR, new SpikesFourSubStateMachine(this))
  }

  private initAnimationEvent() {
    // this.animationComponent.on(Animation.EventType.FINISHED, () => {
    //   const name = this.animationComponent.defaultClip.name
    //   const whiteList = ['attack']
    //   if (whiteList.some(v => name.includes(v))) {
    //     this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
    //   }
    // })
  }

  run() {
    const value = this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)
    switch (this.currentState) {
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE):
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TOW):
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE):
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR):
        if (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE) {
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
        } else if (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_TOW) {
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TOW)
        } else if (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_THREE) {
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE)
        } else if (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_FOUR) {
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR)
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
    }
  }
}


