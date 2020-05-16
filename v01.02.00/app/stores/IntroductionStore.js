import alt from '../alt';
import IntroductionActions from '../actions/IntroductionActions';

class IntroductionStore {
  constructor() {
    this.bindActions(IntroductionActions);
    this.partners = [];
    this.partner = {products: [], productCompanys: []};
  }

  onGetPartnersSuccess(data) {
    this.partners = data;
  }

  onGetPartnersFail(message) {
    this.partners = [];
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
}

export default alt.createStore(IntroductionStore, 'IntroductionStore');