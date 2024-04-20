import { _decorator, Component, Node } from 'cc'
import { TileMapManager } from 'db://assets/Script/Tile/TileMapManager'
import { createUINode } from 'db://assets/Utils'

const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  start() {
    this.generateTileMap()
  }

  private generateTileMap() {
    const stage = createUINode()
    stage.setParent(this.node)

    const tileMap = createUINode()
    tileMap.setParent(stage)
    const tileMapManager = tileMap.addComponent(TileMapManager)

    tileMapManager.init()

    this.adaptPos()
  }

  private adaptPos() {

  }
}
