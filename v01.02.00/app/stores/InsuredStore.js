import alt from '../alt';
import InsuredActions from '../actions/InsuredActions';

class InsuredStore {
  constructor() {
    this.bindActions(InsuredActions);
    this.unPaidOrder = {};
    this.confirmFooter = '进入修改';
    this.orderNum = 1;
    this.orderInfoId = '';
  }
}

export default alt.createStore(InsuredStore, 'InsuredStore');