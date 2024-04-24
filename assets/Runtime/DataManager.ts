import { ILevel, ITile } from 'db://assets/Levels'
import Singleton from 'db://assets/Base/Singleton'
import { TileManager } from 'db://assets/Script/Tile/TileManager'
import { PlayerManager } from 'db://assets/Script/Player/PlayerManager'
import { WoodenSkeletonManager } from 'db://assets/Script/WoodenSkeleton/WoodenSkeletonManager'
import { DoorManager } from 'db://assets/Script/Door/DoorManager'
import { EnemyManager } from 'db://assets/Base/EnemyManager'
import { BurstManager } from 'db://assets/Script/Burst/BurstManager'
import { SpikesManager } from 'db://assets/Script/Spikes/SpikesManager'
import { SmokeManager } from 'db://assets/Script/Smoke/SmokeManager'

export type IRecord = Omit<ILevel, 'mapInfo'>

export default class DataManager extends Singleton {
  mapRowCount: number = 0
  mapColumnCount: number = 0
  levelIndex: number = 1
  mapInfo: Array<Array<ITile>>
  tileInfo: Array<Array<TileManager>>
  player: PlayerManager = null
  door: DoorManager = null
  enemies: EnemyManager[]
  bursts: BurstManager[]
  spikes: SpikesManager[]
  smokes: SmokeManager[]
  records: IRecord[]

  static get Instance() {
    return super.GetInstance<DataManager>()
  }

  reset() {
    this.mapRowCount = 0
    this.mapColumnCount = 0
    this.mapInfo = []
    this.tileInfo = []
    this.player = null
    this.door = null
    this.enemies = []
    this.bursts = []
    this.spikes = []
    this.smokes = []
    this.records = []
  }
}