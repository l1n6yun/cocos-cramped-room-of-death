import { _decorator, Animation } from 'cc'
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from 'db://assets/Enums'
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from 'db://assets/Base/StateMachine'
import TurnLeftSubStateMachine from 'db://assets/Script/Player/TurnLeftSubStateMachine'
import BlockFrontSubStateMachine from 'db://assets/Script/Player/BlockFrontSubStateMachine'
import { EntityManager } from 'db://assets/Base/EntityManager'
import BlockTurnLeftSubStateMachine from 'db://assets/Script/Player/BlockTurnLeftSubStateMachine'
import IdleSubStateMachine from 'db://assets/Script/WoodenSkeleton/IdleSubStateMachine'
import AttackSubStateMachine from 'db://assets/Script/WoodenSkeleton/AttackSubStateMachine'
import DeathSubStateMachine from 'db://assets/Script/WoodenSkeleton/DeathSubStateMachine'

const { ccclass, property } = _decorator


@ccclass('WoodenSkeletonStateMachine')
export class WoodenSkeletonStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.addComponent(Animation)

    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  private initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
  }

  private initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
  }

  private initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whiteList = ['attack']
      if (whiteList.some(v => name.includes(v))) {
        this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
      }
    })
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
        if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
        } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}


