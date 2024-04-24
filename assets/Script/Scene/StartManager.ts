import { _decorator, Component, director, Node } from 'cc'
import EventManager from 'db://assets/Runtime/EventManager'
import { CONTROLLER_ENUM, EVENT_ENUM, SCENE_ENUM } from 'db://assets/Enums'
import FaderManager from 'db://assets/Runtime/FaderManager'

const { ccclass, property } = _decorator

@ccclass('StartManager')
export class StartManager extends Component {
  onLoad() {
    FaderManager.Instance.fadeOut(1000)
    this.node.once(Node.EventType.TOUCH_END, this.handleStart, this)
  }

  private async handleStart() {
    await FaderManager.Instance.fadeIn(300)

    director.loadScene(SCENE_ENUM.Battle)
  }
}


