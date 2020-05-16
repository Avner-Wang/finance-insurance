import alt from '../alt';
import { ajaxPost } from '../components/common/Utils';

class PolicyActions {
  
  constructor() {
    this.generateActions (
      'getPolicySuccess',
      'getPolicyFail',
      'initState'
    );
  }

  getPolicy(data) {
    ajaxPost(data, '/insuranceApi/api/v1/queryUserPolicyById',
      (function(result) {
        this.getPolicySuccess(result);
      }).bind(this),
      (function() {
        this.getPolicyFail();
      }).bind(this), $('#page-loading'), null, this);

    return true;
  }

  initState() {
    this.initState();
    return true;
  }
}

export default alt.createActions(PolicyActions);