import alt from '../alt';
import { ajaxPost } from '../components/common/Utils';

class PolicyBuyActions {
  
  constructor() {
    this.generateActions (
      'initState',
      'initPolicyInfo',
      'initMainInsured'
    );
  }

  getPremium(data, callback) {
    ajaxPost(data, '/insuranceApi/api/v1/querySweetPremium',
      function(result, callback) {
        callback(null, result.premium);
      },
      null, null, callback);
    return true;
  }

  orderSubmit(data, router) {
    ajaxPost(data, '/insuranceApi/api/v1/sweetInsure',
      function(result, router) {
        router.replace('/order/' + result.orderInfoId);
      },
      null, $('#submit-loading'), router);
    return true;
  }

  getOrderInfo(data, callback) {
    ajaxPost(data, '/insuranceApi/api/v1/queryOrderInfoById',
      (function(result, callback) {
        this.initPolicyInfo(result);
        callback(null, result.policyInfo.insured);
      }).bind(this),
      null, $('#page-loading'), callback, this);
    return true;
  }

  getUserInfo(data, callback) {
    ajaxPost(data, '/insuranceApi/api/v1/queryUserLoginInfo',
      (function(result, callback) {
        this.initMainInsured(result);
        callback(null, result.idNumber);
      }).bind(this),
      null, $('#page-loading'), callback, this);
    return true;
  }
  
}

export default alt.createActions(PolicyBuyActions);