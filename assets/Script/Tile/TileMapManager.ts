import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc'
import Levels from 'db://assets/Levels'
import { createUINode } from 'db://assets/Utils'
import { TileManager } from 'db://assets/Script/Tile/TileManager'
import { DataManagerInstance } from 'db://assets/Runtime/DataManager'

const { ccclass, property } = _decorator

export const TILE_WIDTH = 55
export const TILE_HEIGHT = 55

@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init() {
    const { mapInfo } = DataManagerInstance
    const spriteFrames = await this.loadRes()

    for (let i = 0; i < mapInfo.length; i++) {
      const column = mapInfo[i]
      for (let j = 0; j < column.length; j++) {
        const item = column[j]
        if (item.src === null || item.type === null) {
          continue
        }

        const node = createUINode()
        const imgSrc = `tile (${item.src})`
        const spriteFrame = spriteFrames.find(v => v.name === imgSrc) || spriteFrames[0]
        const tileManager = node.addComponent(TileManager)
        tileManager.init(spriteFrame, i, j)
        node.setParent(this.node)
      }
    }
  }

  loadRes() {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir('texture/tile/tile', SpriteFrame, function(err, assets) {
        if (err) {
          reject(err)
          return
        }

        resolve(assets)
      })
    })
  }
}


