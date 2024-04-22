import { _decorator, Component, Node } from 'cc'
import { TileMapManager } from 'db://assets/Script/Tile/TileMapManager'
import { createUINode } from 'db://assets/Utils'
import Levels, { ILevel } from 'db://assets/Levels'
import DataManager from 'db://assets/Runtime/DataManager'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Script/Tile/TileManager'
import EventManager from 'db://assets/Runtime/EventManager'
import { EVENT_ENUM } from 'db://assets/Enums'
import { PlayerManager } from 'db://assets/Script/Player/PlayerManager'
import { WoodenSkeletonManager } from 'db://assets/Script/WoodenSkeleton/WoodenSkeletonManager'

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
      this.generatePlayer()
      this.generateEnemies()
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

  private generateTileMap() {

    const tileMap = createUINode()
    tileMap.setParent(this.stage)
    const tileMapManager = tileMap.addComponent(TileMapManager)

    tileMapManager.init()

    this.adaptPos()
  }

  private generatePlayer() {
    const player = createUINode()
    player.setParent(this.stage)
    const playerManager = player.addComponent(PlayerManager)
    playerManager.init()
  }

  private generateEnemies() {
    const enemies = createUINode()
    enemies.setParent(this.stage)
    const woodenSkeletonManager = enemies.addComponent(WoodenSkeletonManager)
    woodenSkeletonManager.init()
  }

  private adaptPos() {
    const { mapRowCount, mapColumnCount } = DataManager.Instance
    const disX = TILE_WIDTH * mapRowCount / 2
    const disY = TILE_HEIGHT * mapColumnCount / 2 + 80
    this.stage.setPosition(-disX, disY)
  }
}
