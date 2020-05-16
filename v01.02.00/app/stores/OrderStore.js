import alt from '../alt';
import OrderActions from '../actions/OrderActions';

class OrderStore {
  constructor() {
    this.bindActions(OrderActions);
    this.onInitState();
  }

  onGetOrderSuccess(data) {
    this.policy = data.policyInfo;
    this.order = data.orderInfo;
  }
  
  onGetOrderFail() {
    this.onInitState();
  }

  onInitState() {
    this.policy = {insured: []};
    this.order = {};
    this.leaveConfirm = false;
  }
}

export default alt.createStore(OrderStore, 'OrderStore');