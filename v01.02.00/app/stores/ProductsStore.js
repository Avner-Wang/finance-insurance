import alt from '../alt';
import ProductsActions from '../actions/ProductsActions';

class ProductsStore {
  constructor() {
    this.bindActions(ProductsActions);
    this.products = [];
    this.barrageShow = false;
    this.currentProject = {};
    this.messagesNumber = {};
    this.user = {};
    this.filter = '';
    this.filterProducts = [];
  }

  onGetProductsSuccess(data) {
    this.products = data;
  }

  onGetProductsFail(message) {
    this.products = [];
  }

  onGetMessagesNumberSuccess(data) {
    this.messagesNumber = data;
  }

  onGetMessagesNumberFail(message) {
    this.messagesNumber = {};
  }

  onGetUserSuccess(data) {
    this.user = data;
  }

  onGetUserFail(message) {
    this.user = {};
  }

  onSetFilterProducts(products) {
    this.filterProducts = products;
  }

  onSetFilter(filter) {
    this.filter = filter;
  }
}

export default alt.createStore(ProductsStore, 'ProductsStore');