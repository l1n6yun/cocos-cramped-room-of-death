import level1 from 'db://assets/Levels/Level1'
import { TILE_TYPE_ENUM } from 'db://assets/Enums'

export interface ITile {
  src: number | null
  type: TILE_TYPE_ENUM | null
}

export interface ILevel {
  mapInfo: Array<Array<ITile>>
}

const levels = {
  level1,
}

export default levels
