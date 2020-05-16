import alt from '../alt';
import PolicyActions from '../actions/PolicyActions';
import { getProductFiles } from '../components/common/Utils';

class PolicyStore {
  constructor() {
    this.bindActions(PolicyActions);
    this.onInitState();
  }

  onGetPolicySuccess(data) {
    if (!data.insured) {
      data.insured = {insured: []};
    }
    this.policy = data;
    this.productFiles = getProductFiles(data.productCode);
  }
  
  onGetPolicyFail() {
    this.onInitState();
  }

  onInitState() {
    this.policy = {insured: []};
    this.insurancebaseid = '';
    this.productFiles = [];
  }
}

export default alt.createStore(PolicyStore, 'PolicyStore');