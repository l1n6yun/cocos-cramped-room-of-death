import { _decorator } from 'cc'
import EventManager from 'db://assets/Runtime/EventManager'
import { CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from 'db://assets/Enums'
import { PlayerStateMachine } from 'db://assets/Script/Player/PlayerStateMachine'
import { EntityManager } from 'db://assets/Base/EntityManager'
import DataManager from 'db://assets/Runtime/DataManager'

const { ccclass, property } = _decorator


@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  targetX: number = 0
  targetY: number = 0
  private readonly speed = 1 / 10

  async init() {
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()

    super.init({
      x: 2,
      y: 8,
      type: ENTITY_TYPE_ENUM.PLAYER,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
    this.targetX = this.x
    this.targetY = this.y

    this.direction = DIRECTION_ENUM.TOP
    this.state = ENTITY_STATE_ENUM.IDLE

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this)
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

    if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1) {
      this.x = this.targetX
      this.y = this.targetY
    }
  }

  inputHandle(inputDirection: CONTROLLER_ENUM) {
    if (this.willBlock(inputDirection)) {
      console.log('block')
      return
    }

    this.move(inputDirection)
  }

  move(inputDirection: CONTROLLER_ENUM) {
    if (inputDirection === CONTROLLER_ENUM.TOP) {
      this.targetY -= 1
    } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
      this.targetY += 1
    } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
      this.targetX -= 1
    } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
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
        if (playerNextY > tileInfo.length) {
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
        if (playerNextY > tileInfo.length) {
          return true
        }
      }

      let playerTile = tileInfo[playerNextX][playerNextY]
      let weaponTile = tileInfo[weaponNextX][weaponNextY]
      if (playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)) {
        // empty
      } else {
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
        return true
      }
    }


    return false
  }
}
