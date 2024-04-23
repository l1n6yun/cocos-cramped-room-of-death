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
import { IronSkeletonManager } from 'db://assets/Script/IronSkeleton/IronSkeletonManager'
import { BurstManager } from 'db://assets/Script/Burst/BurstManager'
import { SpikesManager } from 'db://assets/Script/Spikes/SpikesManager'

const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  private level: ILevel
  private stage: Node

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
  }

  start() {
    this.generateStage()
    this.initLevel()
  }

  initLevel() {
    const level = Levels[`level${DataManager.Instance.levelIndex}`]
    if (level) {
      this.clearLevel()
      this.level = level

      DataManager.Instance.mapInfo = this.level.mapInfo
      DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0
      DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0

      this.generateTileMap()
      // this.generateBursts()
      this.generateSpikes()
      this.generateDoor()
      this.generateEnemies()
      this.generatePlayer()
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
    await playerManager.init({
      x: 2,
      y: 8,
      type: ENTITY_TYPE_ENUM.PLAYER,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
    DataManager.Instance.player = playerManager
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
  }

  private async generateEnemies() {
    const enemies1 = createUINode()
    enemies1.setParent(this.stage)
    const woodenSkeletonManager = enemies1.addComponent(WoodenSkeletonManager)
    await woodenSkeletonManager.init({
      x: 2,
      y: 4,
      type: ENTITY_TYPE_ENUM.SKELETON_WOODEN,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
    DataManager.Instance.enemies.push(woodenSkeletonManager)

    const enemies2 = createUINode()
    enemies2.setParent(this.stage)
    const ironSkeletonManager = enemies2.addComponent(IronSkeletonManager)
    await ironSkeletonManager.init({
      x: 2,
      y: 2,
      type: ENTITY_TYPE_ENUM.SKELETON_IRON,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
    DataManager.Instance.enemies.push(ironSkeletonManager)
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
    await doorManager.init({
      x: 7,
      y: 8,
      type: ENTITY_TYPE_ENUM.DOOR,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
    DataManager.Instance.door = doorManager
  }

  private async generateBursts() {
    const bursts = createUINode()
    bursts.setParent(this.stage)
    const burstManager = bursts.addComponent(BurstManager)
    await burstManager.init({
      x: 2,
      y: 6,
      type: ENTITY_TYPE_ENUM.BURST,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
    DataManager.Instance.bursts.push(burstManager)
  }

  private async generateSpikes() {
    const spikes = createUINode()
    spikes.setParent(this.stage)
    const spikesManager = spikes.addComponent(SpikesManager)
    await spikesManager.init({
      x: 2,
      y: 6,
      type: ENTITY_TYPE_ENUM.SPIKES_FOUR,
      count: 0,
    })
    DataManager.Instance.spikes.push(spikesManager)
  }
}
