import alt from '../alt';
import { ajaxPost } from '../components/common/Utils';

class OrderListActions {
  
  constructor() {
    this.generateActions ();
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

export default alt.createActions(OrderListActions);