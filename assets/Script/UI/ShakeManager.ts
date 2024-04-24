import { _decorator, Component, game, Node } from 'cc'
import EventManager from 'db://assets/Runtime/EventManager'
import { CONTROLLER_ENUM, EVENT_ENUM, SHAKE_TYPE_ENUM } from 'db://assets/Enums'

const { ccclass, property } = _decorator

@ccclass('ShakeManager')
export class ShakeManager extends Component {
  private isShaking: boolean = false
  private oldTime: number = 0
  private oldPos: { x: number, y: number } = { x: 0, y: 0 }
  private type: SHAKE_TYPE_ENUM


  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE, this.onShake)
  }

  private onShake(type: SHAKE_TYPE_ENUM) {
    if (this.isShaking) {
      return
    }

    this.type = type
    this.oldTime = game.totalTime
    this.isShaking = true
    this.oldPos.x = this.node.position.x
    this.oldPos.y = this.node.position.y
  }

  stop() {
    this.isShaking = false
  }

  update() {
    if (this.isShaking) {
      const duration = 200
      const amount = 16
      const frequency = 12
      const curSecond = (game.totalTime - this.oldTime) / 1000
      const totalSecond = duration / 1000
      const offset = amount * Math.sin(frequency * Math.PI * curSecond)

      if (this.type === SHAKE_TYPE_ENUM.TOP) {
        this.node.setPosition(this.oldPos.x, this.oldPos.y - offset)
      } else if (this.type === SHAKE_TYPE_ENUM.BOTTOM) {
        this.node.setPosition(this.oldPos.x, this.oldPos.y + offset)
      } else if (this.type === SHAKE_TYPE_ENUM.LEFT) {
        this.node.setPosition(this.oldPos.x - offset, this.oldPos.y)
      } else if (this.type === SHAKE_TYPE_ENUM.RIGHT) {
        this.node.setPosition(this.oldPos.x + offset, this.oldPos.y)
      }
      if (curSecond > totalSecond) {
        this.isShaking = false
        this.node.setPosition(this.oldPos.x, this.oldPos.y)
      }
    }
  }
}


