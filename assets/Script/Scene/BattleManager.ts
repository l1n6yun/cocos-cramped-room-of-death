import { _decorator, Component, Node } from 'cc'
import { TileMapManager } from 'db://assets/Script/Tile/TileMapManager'
import { createUINode } from 'db://assets/Utils'
import Levels, { ILevel } from 'db://assets/Levels'
import { DataManagerInstance } from 'db://assets/Runtime/DataManager'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Script/Tile/TileManager'

const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  private level: ILevel
  private stage: Node

  start() {
    this.generateStage()
    this.initLevel()
  }

  initLevel() {
    const level = Levels[`level${1}`]
    if (level) {
      this.level = level

      DataManagerInstance.mapInfo = this.level.mapInfo
      DataManagerInstance.mapRowCount = this.level.mapInfo.length || 0
      DataManagerInstance.mapColumnCount = this.level.mapInfo[0].length || 0

      this.generateTileMap()
    }
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

  private adaptPos() {
    const { mapRowCount, mapColumnCount } = DataManagerInstance
    const disX = TILE_WIDTH * mapRowCount / 2
    const disY = TILE_HEIGHT * mapColumnCount / 2 + 80
    this.stage.setPosition(-disX, disY)
  }
}
