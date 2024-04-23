import { _decorator } from 'cc'
import EventManager from 'db://assets/Runtime/EventManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from 'db://assets/Enums'
import { EntityManager } from 'db://assets/Base/EntityManager'
import DataManager from 'db://assets/Runtime/DataManager'
import { WoodenSkeletonStateMachine } from 'db://assets/Script/WoodenSkeleton/WoodenSkeletonStateMachine'
import { EnemyManager } from 'db://assets/Base/EnemyManager'
import { IEntity } from 'db://assets/Levels'
import { IronSkeletonStateMachine } from 'db://assets/Script/IronSkeleton/IronSkeletonStateMachine'
import { SmokeStateMachine } from 'db://assets/Script/Smoke/SmokeStateMachine'

const { ccclass, property } = _decorator


@ccclass('SmokeManager')
export class SmokeManager extends EntityManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(SmokeStateMachine)
    await this.fsm.init()
    super.init(params)
  }
}
