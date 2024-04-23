import { ITile } from 'db://assets/Levels'
import Singleton from 'db://assets/Base/Singleton'
import { TileManager } from 'db://assets/Script/Tile/TileManager'
import { PlayerManager } from 'db://assets/Script/Player/PlayerManager'
import { WoodenSkeletonManager } from 'db://assets/Script/WoodenSkeleton/WoodenSkeletonManager'
import { DoorManager } from 'db://assets/Script/Door/DoorManager'
import { EnemyManager } from 'db://assets/Base/EnemyManager'
import { BurstManager } from 'db://assets/Script/Burst/BurstManager'
import { SpikesManager } from 'db://assets/Script/Spikes/SpikesManager'
import { SmokeManager } from 'db://assets/Script/Smoke/SmokeManager'
import { DEFAULT_DURATION, DrawManager } from 'db://assets/Script/UI/DrawManager'
import { createUINode } from 'db://assets/Utils'
import { RenderRoot2D, director, game } from 'cc'

export default class FaderManager extends Singleton {
  static get Instance() {
    return super.GetInstance<FaderManager>()
  }

  private _fader: DrawManager = null

  get fader() {
    if (this._fader !== null) {
      return this._fader
    }

    const root = createUINode()
    root.addComponent(RenderRoot2D)

    const fadeNode = createUINode()
    fadeNode.setParent(root)
    this._fader = fadeNode.addComponent(DrawManager)
    this._fader.init()

    director.addPersistRootNode(root)

    return this._fader
  }

  fadeIn(duration = DEFAULT_DURATION) {
    return this.fader.fadeIn(duration)
  }

  fadeOut(duration = DEFAULT_DURATION) {
    return this.fader.fadeOut(duration)
  }
}