import alt from '../alt';
import BarrageActions from '../actions/BarrageActions';

class BarrageStore {
  constructor() {
    this.bindActions(BarrageActions);
    this.show = false;
    this.barrageMessages = [];
    this.project = {};
    this.messageKey = null;
    this.hasMessage = true;
    this.page = 1;
    this.skip = 0;
  }

  onUpdateBarrageMessages(data) {
    if (data instanceof Array) {
      this.hasMessage = (data.length != 0);
      this.barrageMessages.push(...data);
    } else if (data instanceof Object) {
      this.barrageMessages.unshift(data);
    }
  }

  onIncreaseSkip() {
    this.skip++;
  }

  onIncreasePage() {
    this.page++;
  }

  onUpdateState(state) {
    this.show = state.show;
    this.barrageMessages = state.barrageMessages;
    this.project = state.project;
    this.messageKey = state.messageKey;
    this.hasMessage = state.hasMessage;
    this.page = state.page;
    this.skip = state.skip;
  }

}

export default alt.createStore(BarrageStore, 'BarrageStore');