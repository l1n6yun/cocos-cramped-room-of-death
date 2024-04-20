import { ITile } from 'db://assets/Levels'
import Singleton from 'db://assets/Base/Singleton'

export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>()
  }

  mapInfo: Array<Array<ITile>>
  mapRowCount: number
  mapColumnCount: number
}