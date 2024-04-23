import { _decorator } from 'cc'
import EventManager from 'db://assets/Runtime/EventManager'
import { CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from 'db://assets/Enums'
import { PlayerStateMachine } from 'db://assets/Script/Player/PlayerStateMachine'
import { EntityManager } from 'db://assets/Base/EntityManager'
import DataManager from 'db://assets/Runtime/DataManager'
import { IEntity } from 'db://assets/Levels'

const { ccclass, property } = _decorator


@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  targetX: number = 0
  targetY: number = 0
  isMoving: boolean = false
  private readonly speed = 1 / 10

  async init(params: IEntity) {
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()

    super.init(params)
    this.targetX = this.x
    this.targetY = this.y

    this.direction = DIRECTION_ENUM.TOP
    this.state = ENTITY_STATE_ENUM.IDLE

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDead, this)
  }

  update() {
    this.updateXY()
    super.update()
  }

  updateXY() {
    if (this.targetX < this.x) {
      this.x -= this.speed
    } else if (this.targetX > this.x) {
      this.x += this.speed
    }

    if (this.targetY < this.y) {
      this.y -= this.speed
    } else if (this.targetY > this.y) {
      this.y += this.speed
    }

    if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1 && this.isMoving) {
      this.isMoving = false
      this.x = this.targetX
      this.y = this.targetY
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    }
  }

  inputHandle(inputDirection: CONTROLLER_ENUM) {
    if (this.isMoving) {
      return
    }

    if (
      this.state === ENTITY_STATE_ENUM.DEATH ||
      this.state === ENTITY_STATE_ENUM.AIRDEATH ||
      this.state === ENTITY_STATE_ENUM.ATTACK
    ) {
      return
    }

    const id = this.willAttack(inputDirection)
    if (id) {
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY, id)
      EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)
      return
    }

    if (this.willBlock(inputDirection)) {
      console.log('block')
      return
    }

    this.move(inputDirection)
  }

  move(inputDirection: CONTROLLER_ENUM) {
    if (inputDirection === CONTROLLER_ENUM.TOP) {
      this.isMoving = true
      this.targetY -= 1
    } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
      this.isMoving = true
      this.targetY += 1
    } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
      this.isMoving = true
      this.targetX -= 1
    } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
      this.isMoving = true
      this.targetX += 1
    } else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.TOP
      }
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
      this.state = ENTITY_STATE_ENUM.TURNLEFT
    }
  }

  private willBlock(inputDirection: CONTROLLER_ENUM) {
    const { targetX: x, targetY: y, direction } = this
    const { tileInfo } = DataManager.Instance

    if (inputDirection !== CONTROLLER_ENUM.TURNLEFT) {
      let playerNextX
      let playerNextY
      let weaponNextX
      let weaponNextY

      if (inputDirection === CONTROLLER_ENUM.TOP) {
        playerNextX = x
        playerNextY = y - 1
        if (direction == DIRECTION_ENUM.TOP) {
          weaponNextX = x
          weaponNextY = y - 2
        } else if (direction == DIRECTION_ENUM.BOTTOM) {
          weaponNextX = x
          weaponNextY = y
        } else if (direction == DIRECTION_ENUM.LEFT) {
          weaponNextX = x - 1
          weaponNextY = y - 1
        } else if (direction == DIRECTION_ENUM.RIGHT) {
          weaponNextX = x + 1
          weaponNextY = y - 1
        }
        if (playerNextY < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT
          return true
        }
      } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
        playerNextX = x
        playerNextY = y + 1
        if (direction == DIRECTION_ENUM.TOP) {
          weaponNextX = x
          weaponNextY = y
        } else if (direction == DIRECTION_ENUM.BOTTOM) {
          weaponNextX = x
          weaponNextY = y + 2
        } else if (direction == DIRECTION_ENUM.LEFT) {
          weaponNextX = x - 1
          weaponNextY = y + 1
        } else if (direction == DIRECTION_ENUM.RIGHT) {
          weaponNextX = x + 1
          weaponNextY = y + 1
        }
        if (playerNextY > tileInfo.length) {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT
          return true
        }
      } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
        playerNextX = x - 1
        playerNextY = y
        if (direction == DIRECTION_ENUM.TOP) {
          weaponNextX = x - 1
          weaponNextY = y - 1
        } else if (direction == DIRECTION_ENUM.BOTTOM) {
          weaponNextX = x - 1
          weaponNextY = y + 1
        } else if (direction == DIRECTION_ENUM.LEFT) {
          weaponNextX = x - 2
          weaponNextY = y
        } else if (direction == DIRECTION_ENUM.RIGHT) {
          weaponNextX = x
          weaponNextY = y
        }
        if (playerNextX < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT
          return true
        }
      } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
        playerNextX = x + 1
        playerNextY = y
        if (direction == DIRECTION_ENUM.TOP) {
          weaponNextX = x + 1
          weaponNextY = y - 1
        } else if (direction == DIRECTION_ENUM.BOTTOM) {
          weaponNextX = x + 1
          weaponNextY = y + 1
        } else if (direction == DIRECTION_ENUM.LEFT) {
          weaponNextX = x
          weaponNextY = y
        } else if (direction == DIRECTION_ENUM.RIGHT) {
          weaponNextX = x + 2
          weaponNextY = y
        }
        if (playerNextX > tileInfo[0].length) {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT
          return true
        }

      }

      let playerTile = tileInfo[playerNextX][playerNextY]
      let weaponTile = tileInfo[weaponNextX][weaponNextY]
      if (playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)) {
        // empty
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCKFRONT
        return true
      }
    }

    if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
      let nextX
      let nextY
      if (direction === DIRECTION_ENUM.TOP) {
        nextX = x - 1
        nextY = y - 1
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        nextX = x + 1
        nextY = x + 1
      } else if (direction === DIRECTION_ENUM.LEFT) {
        nextX = x - 1
        nextY = y + 1
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        nextX = x + 1
        nextY = y - 1
      }

      if (
        (!tileInfo[x][nextY] || tileInfo[x][nextY].turnable) &&
        (!tileInfo[nextX][y] || tileInfo[nextX][y].turnable) &&
        (!tileInfo[x][y] || tileInfo[x][y].turnable)
      ) {
        //empty
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT
        return true
      }
    }


    return false
  }

  private onDead(type: ENTITY_STATE_ENUM) {
    this.state = type
  }

  private willAttack(type: CONTROLLER_ENUM) {
    const enemies = DataManager.Instance.enemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH)
    for (let i = 0; i < enemies.length; i++) {
      const { x: enemieX, y: enemieY, id: enemyId } = enemies[i]
      if (
        type === CONTROLLER_ENUM.TOP &&
        this.direction === DIRECTION_ENUM.TOP &&
        enemieX === this.x &&
        enemieY === this.targetY - 2
      ) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        return enemyId
      } else if (
        type === CONTROLLER_ENUM.LEFT &&
        this.direction === DIRECTION_ENUM.LEFT &&
        enemieX === this.x - 2 &&
        enemieY === this.targetY
      ) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        return enemyId
      } else if (
        type === CONTROLLER_ENUM.BOTTOM &&
        this.direction === DIRECTION_ENUM.BOTTOM &&
        enemieX === this.x &&
        enemieY === this.targetY + 2
      ) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        return enemyId
      } else if (
        type === CONTROLLER_ENUM.RIGHT &&
        this.direction === DIRECTION_ENUM.RIGHT &&
        enemieX === this.x + 2 &&
        enemieY === this.targetY
      ) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        return enemyId
      }
    }

    return ''
  }
}
