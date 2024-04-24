import { _decorator, Component, game, Node } from 'cc'
import EventManager from 'db://assets/Runtime/EventManager'
import { CONTROLLER_ENUM, EVENT_ENUM } from 'db://assets/Enums'

const { ccclass, property } = _decorator

@ccclass('ShakeManager')
export class ShakeManager extends Component {
  private isShaking: boolean = false
  private oldTime: number = 0
  private oldPos: { x: number, y: number } = { x: 0, y: 0 }


  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE, this.onShake)
  }

  private onShake() {
    if (this.isShaking) {
      return
    }

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
      const duration = 1000
      const amount = 1.6
      const frequency = 12
      const curSecond = (game.totalTime - this.oldTime) / 1000
      const totalSecond = duration / 1000
      const offset = amount * Math.sin(frequency / Math.PI * curSecond)
      this.node.setPosition(this.oldPos.x, this.oldPos.y + offset)
      if (curSecond > totalSecond) {
        this.isShaking = false
        this.node.setPosition(this.oldPos.x, this.oldPos.y)
      }
    }
  }
}


