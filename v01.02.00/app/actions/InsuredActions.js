import alt from '../alt';
import { ajaxPost } from '../components/common/Utils';

class InsuredActions {
  
  constructor() {
    this.generateActions (
    );
  }

  getUnpaidOrder(data, callback) {
    ajaxPost(data, '/insuranceApi/api/v1/sweetQueryUnpaidOrder',
      function(result, callback) {
        callback(null, result);
      },
      null, $('#query-loading'), callback);
    return true;
  }
  
}

export default alt.createActions(InsuredActions);