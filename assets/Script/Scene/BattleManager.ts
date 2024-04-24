import { _decorator, Component, Node } from 'cc'
import { TileMapManager } from 'db://assets/Script/Tile/TileMapManager'
import { createUINode } from 'db://assets/Utils'
import Levels, { ILevel } from 'db://assets/Levels'
import DataManager, { IRecord } from 'db://assets/Runtime/DataManager'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Script/Tile/TileManager'
import EventManager from 'db://assets/Runtime/EventManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from 'db://assets/Enums'
import { PlayerManager } from 'db://assets/Script/Player/PlayerManager'
import { WoodenSkeletonManager } from 'db://assets/Script/WoodenSkeleton/WoodenSkeletonManager'
import { DoorManager } from 'db://assets/Script/Door/DoorManager'
import { BurstManager } from 'db://assets/Script/Burst/BurstManager'
import { SpikesManager } from 'db://assets/Script/Spikes/SpikesManager'
import { IronSkeletonManager } from 'db://assets/Script/IronSkeleton/IronSkeletonManager'
import { SmokeManager } from 'db://assets/Script/Smoke/SmokeManager'
import FaderManager from 'db://assets/Runtime/FaderManager'
import { ShakeManager } from 'db://assets/Script/UI/ShakeManager'

const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  private level: ILevel
  private stage: Node
  private smokeLayer: Node

  onLoad() {
    DataManager.Instance.levelIndex = 1
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this)
    EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this)
    EventManager.Instance.on(EVENT_ENUM.RECORD_STEP, this.record, this)
    EventManager.Instance.on(EVENT_ENUM.REVOKE_STEP, this.revoke, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived)
    EventManager.Instance.off(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke)
    EventManager.Instance.off(EVENT_ENUM.RECORD_STEP, this.record)
    EventManager.Instance.off(EVENT_ENUM.REVOKE_STEP, this.revoke)

    EventManager.Instance.clear()
  }

  start() {
    this.generateStage()
    this.initLevel()
  }

  async initLevel() {
    const level = Levels[`level${DataManager.Instance.levelIndex}`]
    if (level) {
      await FaderManager.Instance.fadeIn()
      this.clearLevel()
      this.level = level

      DataManager.Instance.mapInfo = this.level.mapInfo
      DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0
      DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0

      await Promise.all([
        this.generateTileMap(),
        this.generateBursts(),
        this.generateSpikes(),
        this.generateSmokeLayer(),
        this.generateDoor(),
        this.generateEnemies(),
        this.generatePlayer(),
      ])

      await FaderManager.Instance.fadeOut()
    }
  }

  nextLevel() {
    DataManager.Instance.levelIndex++
    this.initLevel()
  }

  clearLevel() {
    this.stage.destroyAllChildren()
    DataManager.Instance.reset()
  }

  private generateStage() {
    this.stage = createUINode()
    this.stage.setParent(this.node)
    this.stage.addComponent(ShakeManager)
  }

  private async generateTileMap() {
    const tileMap = createUINode()
    tileMap.setParent(this.stage)
    const tileMapManager = tileMap.addComponent(TileMapManager)
    await tileMapManager.init()
    this.adaptPos()
  }

  private async generatePlayer() {
    const player = createUINode()
    player.setParent(this.stage)
    const playerManager = player.addComponent(PlayerManager)
    await playerManager.init(this.level.player)
    DataManager.Instance.player = playerManager
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
  }

  private async generateEnemies() {
    const promise = []
    for (let i = 0; i < this.level.enemies.length; i++) {
      const enemy = this.level.enemies[i]
      const node = createUINode()
      node.setParent(this.stage)
      const Manager = enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN ? WoodenSkeletonManager : IronSkeletonManager
      const manager = node.addComponent(Manager)
      promise.push(manager.init(enemy))
      DataManager.Instance.enemies.push(manager)
    }
    await Promise.all(promise)
  }

  private adaptPos() {
    const { mapRowCount, mapColumnCount } = DataManager.Instance
    const disX = TILE_WIDTH * mapRowCount / 2
    const disY = TILE_HEIGHT * mapColumnCount / 2 + 80
    this.stage.getComponent(ShakeManager).stop()
    this.stage.setPosition(-disX, disY)
  }

  private async generateDoor() {
    const door = createUINode()
    door.setParent(this.stage)
    const doorManager = door.addComponent(DoorManager)
    await doorManager.init(this.level.door)
    DataManager.Instance.door = doorManager
  }

  private async generateBursts() {
    const promise = []
    for (let i = 0; i < this.level.bursts.length; i++) {
      const burst = this.level.bursts[i]
      const node = createUINode()
      node.setParent(this.stage)
      const burstManager = node.addComponent(BurstManager)
      promise.push(burstManager.init(burst))
      DataManager.Instance.bursts.push(burstManager)
    }
    await Promise.all(promise)
  }

  private async generateSpikes() {
    const promise = []
    for (let i = 0; i < this.level.spikes.length; i++) {
      const spike = this.level.spikes[i]
      const node = createUINode()
      node.setParent(this.stage)
      const spikesManager = node.addComponent(SpikesManager)
      promise.push(spikesManager.init(spike))
      DataManager.Instance.spikes.push(spikesManager)
    }
    await Promise.all(promise)
  }

  private checkArrived() {
    if (!DataManager.Instance.player || !DataManager.Instance.door) {
      return
    }

    const { x: playerX, y: playerY } = DataManager.Instance.player
    const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door
    if (playerX === doorX && playerY === doorY && doorState === ENTITY_STATE_ENUM.DEATH) {
      EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
    }
  }

  private async generateSmoke(x: number, y: number, direction: DIRECTION_ENUM) {
    const item = DataManager.Instance.smokes.find(smoke => smoke.state === ENTITY_STATE_ENUM.DEATH)
    if (item) {
      item.x = x
      item.y = y
      item.direction = direction
      item.state = ENTITY_STATE_ENUM.IDLE
      item.node.setPosition(x * TILE_WIDTH - TILE_WIDTH * 1.5, -y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
    } else {
      const smoke = createUINode()
      smoke.setParent(this.smokeLayer)
      const smokeManager = smoke.addComponent(SmokeManager)
      await smokeManager.init({
        x,
        y,
        direction,
        state: ENTITY_STATE_ENUM.IDLE,
        type: ENTITY_TYPE_ENUM.SMOKE,
      })
      DataManager.Instance.smokes.push(smokeManager)
    }
  }

  private async generateSmokeLayer() {
    this.smokeLayer = createUINode()
    this.smokeLayer.setParent(this.stage)
  }

  record() {
    const item: IRecord = {
      player: {
        x: DataManager.Instance.player.x,
        y: DataManager.Instance.player.y,
        direction: DataManager.Instance.player.direction,
        state: DataManager.Instance.player.state === ENTITY_STATE_ENUM.IDLE || DataManager.Instance.player.state === ENTITY_STATE_ENUM.DEATH || DataManager.Instance.player.state === ENTITY_STATE_ENUM.AIRDEATH ? DataManager.Instance.player.state : ENTITY_STATE_ENUM.IDLE,
        type: DataManager.Instance.player.type,
      },
      door: {
        x: DataManager.Instance.door.x,
        y: DataManager.Instance.door.y,
        direction: DataManager.Instance.door.direction,
        state: DataManager.Instance.door.state,
        type: DataManager.Instance.door.type,
      },
      enemies: DataManager.Instance.enemies.map(({ x, y, direction, state, type }) => ({
          x,
          y,
          direction,
          state,
          type,
        }),
      ),
      bursts: DataManager.Instance.bursts.map(({ x, y, direction, state, type }) => ({
          x,
          y,
          direction,
          state,
          type,
        }),
      ),
      spikes: DataManager.Instance.spikes.map(({ x, y, count, type }) => ({
          x,
          y,
          count,
          type,
        }),
      ),
    }

    DataManager.Instance.records.push(item)
  }

  revoke() {
    const item = DataManager.Instance.records.pop()
    if (item) {
      DataManager.Instance.player.x = DataManager.Instance.player.targetX = item.player.x
      DataManager.Instance.player.y = DataManager.Instance.player.targetY = item.player.y
      DataManager.Instance.player.direction = item.player.direction
      DataManager.Instance.player.state = item.player.state

      DataManager.Instance.door.x = item.door.x
      DataManager.Instance.door.y = item.door.y
      DataManager.Instance.door.direction = item.door.direction
      DataManager.Instance.door.state = item.door.state

      for (let i = 0; i < DataManager.Instance.enemies.length; i++) {
        const enemy = item.enemies[i]
        DataManager.Instance.enemies[i].x = enemy.x
        DataManager.Instance.enemies[i].y = enemy.y
        DataManager.Instance.enemies[i].direction = enemy.direction
        DataManager.Instance.enemies[i].state = enemy.state
      }

      for (let i = 0; i < DataManager.Instance.bursts.length; i++) {
        const bursts = item.bursts[i]
        DataManager.Instance.bursts[i].x = bursts.x
        DataManager.Instance.bursts[i].y = bursts.y
        DataManager.Instance.bursts[i].state = bursts.state
      }

      for (let i = 0; i < DataManager.Instance.spikes.length; i++) {
        const spikes = item.spikes[i]
        DataManager.Instance.spikes[i].x = spikes.x
        DataManager.Instance.spikes[i].y = spikes.y
        DataManager.Instance.spikes[i].count = spikes.count
        DataManager.Instance.spikes[i].type = spikes.type
      }
    }
  }
}
