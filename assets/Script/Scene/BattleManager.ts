import { _decorator, Component, Node } from 'cc'
import { TileMapManager } from 'db://assets/Script/Tile/TileMapManager'
import { createUINode } from 'db://assets/Utils'
import Levels, { ILevel } from 'db://assets/Levels'
import DataManager from 'db://assets/Runtime/DataManager'
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
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)

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
}
