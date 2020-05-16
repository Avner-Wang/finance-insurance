import alt from '../alt';
import OrderListActions from '../actions/OrderListActions';

class OrderListStore {
  constructor() {
    this.bindActions(OrderListActions);
    this.orders = [];
    this.currentPage = 1;
    this.pageSize = 10;
    this.loading = false;
    this.error = false;
  }

}

export default alt.createStore(OrderListStore, 'OrderListStore');