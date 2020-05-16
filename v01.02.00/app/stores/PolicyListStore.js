import alt from '../alt';
import PolicyListActions from '../actions/PolicyListActions';

class PolicyListStore {
  constructor() {
    this.bindActions(PolicyListActions);
    this.orders = [];
    this.currentPage = 1;
    this.pageSize = 10;
    this.loading = false;
    this.policyModalShow = false;
    this.orderId = '';
    this.error = false;
  }

}

export default alt.createStore(PolicyListStore, 'PolicyListStore');