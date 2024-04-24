import { _decorator, Component, director, Node, ProgressBar, resources } from 'cc'
import EventManager from 'db://assets/Runtime/EventManager'
import { CONTROLLER_ENUM, EVENT_ENUM, SCENE_ENUM } from 'db://assets/Enums'
import FaderManager from 'db://assets/Runtime/FaderManager'

const { ccclass, property } = _decorator

@ccclass('LoadingManager')
export class LoadingManager extends Component {
  @property(ProgressBar)
  bar: ProgressBar = null

  onLoad() {
    FaderManager.Instance.fadeOut(1000)
    resources.preloadDir('texture', (cur, total) => {
      this.bar.progress = cur / total
    }, () => {
      director.loadScene(SCENE_ENUM.Start)
    })
  }
}


