import alt from '../alt';
import { ajaxPost } from '../components/common/Utils';

class OrderActions {
  
  constructor() {
    this.generateActions (
      'getOrderSuccess',
      'getOrderFail'
    );
  }

  getOrderInfo(data) {
    ajaxPost(data, '/insuranceApi/api/v1/queryOrderInfoById',
      (function(result) {
        this.getOrderSuccess(result);
      }).bind(this),
      (function() {
        this.getOrderFail();
      }).bind(this),
      $('#page-loading'), this);
    return true;
  }

  paySubmit(data) {
    ajaxPost(data, '/insuranceApi/api/v1/sweetGetPayUrl',
      function(result) {
        location.href = result.payUrl;
      },
      null, $('#submit-loading'));
    return true;
  }

}

export default alt.createActions(OrderActions);