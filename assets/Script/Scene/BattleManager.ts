import { _decorator, Component, Node } from 'cc'
import { TileMapManager } from 'db://assets/Script/Tile/TileMapManager'

const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  start() {
    this.generateTileMap()
  }

  private generateTileMap() {
    const stage = new Node()
    stage.setParent(this.node)
    const tileMap = new Node()
    tileMap.setParent(stage)
    const tileMapManager = tileMap.addComponent(TileMapManager)

    tileMapManager.init()
  }
}
