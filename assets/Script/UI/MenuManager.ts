import { _decorator, Component, Node } from 'cc'
import EventManager from 'db://assets/Runtime/EventManager'
import { CONTROLLER_ENUM, EVENT_ENUM } from 'db://assets/Enums'

const { ccclass, property } = _decorator

@ccclass('MenuManager')
export class MenuManager extends Component {
  handleUndo() {
    EventManager.Instance.emit(EVENT_ENUM.REVOKE_STEP)
  }

  handleRestart() {
    EventManager.Instance.emit(EVENT_ENUM.RESTART)
  }

  handleOut() {
    EventManager.Instance.emit(EVENT_ENUM.OUR)
  }
}


