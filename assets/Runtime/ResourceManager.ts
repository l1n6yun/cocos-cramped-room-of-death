import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc'
import { ITile } from 'db://assets/Levels'
import Singleton from 'db://assets/Base/Singleton'

export default class ResourceManager extends Singleton {
  static get Instance() {
    return super.GetInstance<ResourceManager>()
  }

  loadDir(path:string,type: typeof SpriteFrame=SpriteFrame) {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir(path, type, function(err, assets) {
        if (err) {
          reject(err)
          return
        }

        resolve(assets)
      })
    })
  }
}