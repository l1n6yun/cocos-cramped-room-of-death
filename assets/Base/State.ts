import { AnimationClip, Sprite, SpriteFrame, animation } from 'cc'
import { PlayerStateMachine } from 'db://assets/Script/Player/PlayerStateMachine'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Script/Tile/TileManager'
import ResourceManager from 'db://assets/Runtime/ResourceManager'
import { StateMachine } from 'db://assets/Base/StateMachine'
import { sortSpriteFrame } from 'db://assets/Utils'

const ANIMATION_SPEED = 1 / 8

export default class State {
  private animationClip: AnimationClip

  constructor(
    private fsm: StateMachine,
    private path: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
  ) {
    this.init()
  }

  async init() {
    const promise = ResourceManager.Instance.loadDir(this.path)
    this.fsm.waitingList.push(promise)
    const spriteFrame = await promise
    this.animationClip = new AnimationClip()

    const track = new animation.ObjectTrack()
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
    const frames: Array<[number, SpriteFrame]> = sortSpriteFrame(spriteFrame).map((item, index) => [ANIMATION_SPEED * index, item])
    track.channel.curve.assignSorted(frames)
    this.animationClip.addTrack(track)
    this.animationClip.name = this.path
    this.animationClip.duration = frames.length * ANIMATION_SPEED
    this.animationClip.wrapMode = this.wrapMode
  }

  run() {
    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }
}