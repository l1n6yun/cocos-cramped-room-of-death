import { _decorator, Component, Node } from 'cc'
import EventManager from 'db://assets/Runtime/EventManager'
import { EVENT_ENUM } from 'db://assets/Enums'

const { ccclass, property } = _decorator

@ccclass('ControllerManager')
export class ControllerManager extends Component {

  handleCtrl() {
    EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
  }
}


