import { _decorator } from 'cc'
import EventManager from 'db://assets/Runtime/EventManager'
import { CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from 'db://assets/Enums'
import { PlayerStateMachine } from 'db://assets/Script/Player/PlayerStateMachine'
import { EntityManager } from 'db://assets/Base/EntityManager'
import DataManager from 'db://assets/Runtime/DataManager'
import { WoodenSkeletonStateMachine } from 'db://assets/Script/WoodenSkeleton/WoodenSkeletonStateMachine'

const { ccclass, property } = _decorator


@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {

  async init() {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()
    super.init({
      x: 7,
      y: 6,
      type: ENTITY_TYPE_ENUM.PLAYER,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
  }
}
