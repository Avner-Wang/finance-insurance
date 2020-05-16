import alt from '../alt';
import SuccessActions from '../actions/SuccessActions';

class SuccessStore {
  constructor() {
    this.bindActions(SuccessActions);
    this.policy = {grossPremium: '0'};
  }

  onCallbackSuccess(data) {
    this.policy = data;
  }
  
  onCallbackFail() {
    this.policy = {grossPremium: '0'};
  }
}

export default alt.createStore(SuccessStore, 'SuccessStore');