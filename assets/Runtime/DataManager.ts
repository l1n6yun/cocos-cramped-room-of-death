import { ITile } from 'db://assets/Levels'
import Singleton from 'db://assets/Base/Singleton'
import { TileManager } from 'db://assets/Script/Tile/TileManager'
import { PlayerManager } from 'db://assets/Script/Player/PlayerManager'
import { WoodenSkeletonManager } from 'db://assets/Script/WoodenSkeleton/WoodenSkeletonManager'

export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>()
  }

  mapInfo: Array<Array<ITile>>
  tileInfo:Array<Array<TileManager>>
  mapRowCount: number = 0
  mapColumnCount: number = 0
  levelIndex: number = 1
  player: PlayerManager
  enemies: WoodenSkeletonManager[]

  reset() {
    this.mapInfo = []
    this.tileInfo = []
    this.player = null
    this.enemies = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
  }
}